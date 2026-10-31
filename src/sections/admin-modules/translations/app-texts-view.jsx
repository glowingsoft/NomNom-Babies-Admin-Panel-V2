import { useMemo, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { TablePaginationCustom, useTable } from 'src/components/table';
import { useGetAllTranslationsQuery, useSaveAllTranslationsMutation } from 'src/store/Reducer/language';

import { AdminModuleLayout } from '../admin-module-layout';
import { AdminListingCard } from '../components/admin-listing-card';

// ----------------------------------------------------------------------
// One table for every app text: a key per row, one column per language. The same CSV format as the
// app's src/i18n/translations.csv, so texts can move between the app repo and here with Export / Import.

const KEY_RE = /^[a-z0-9_]{1,64}$/;
const marks = (s = '') => [...(s.match(/\{\w+\}/g) || []), '*'.repeat((s.match(/\*/g) || []).length)].sort().join(' ');

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += ch;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c !== ''));
};

const toCsv = (codes, rows) => {
  const q = (v = '') => (/[",\r\n]/.test(v) || /^\s|\s$/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return [['key', ...codes].join(','), ...rows.map((r) => [r.key, ...codes.map((c) => q(r.values[c]))].join(','))].join('\n');
};

export function AppTextsView() {
  const table = useTable({ defaultRowsPerPage: 25 });
  const { data, isLoading, isFetching, refetch } = useGetAllTranslationsQuery();
  const [saveAll, { isLoading: saving }] = useSaveAllTranslationsMutation();
  const info = data?.data;
  const languages = useMemo(() => info?.languages ?? [], [info]);
  const codes = languages.map((l) => l.code);

  // Unsaved changes: edited/added rows by key, and keys to delete.
  const [edits, setEdits] = useState({});
  const [removed, setRemoved] = useState(() => new Set());
  const [search, setSearch] = useState('');
  const [missingOnly, setMissingOnly] = useState(false);
  const [adding, setAdding] = useState(null);
  const fileRef = useRef(null);

  const rows = useMemo(() => {
    const byKey = new Map((info?.rows ?? []).map((r) => [r.key, r.values]));
    Object.entries(edits).forEach(([key, values]) => byKey.set(key, { ...(byKey.get(key) || {}), ...values }));
    return [...byKey.entries()]
      .filter(([key]) => !removed.has(key))
      .map(([key, values]) => ({ key, values }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [info, edits, removed]);

  const isMissing = (r) => codes.some((c) => !r.values[c]?.trim());
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(
      (r) => (!missingOnly || codes.some((c) => !r.values[c]?.trim())) && (!q || r.key.includes(q) || Object.values(r.values).some((v) => v?.toLowerCase().includes(q)))
    );
  }, [rows, search, missingOnly, codes]);
  const page = filtered.slice(table.page * table.rowsPerPage, (table.page + 1) * table.rowsPerPage);
  const dirty = Object.keys(edits).length + removed.size;

  const setCell = (key, code, value) => setEdits((e) => ({ ...e, [key]: { ...(e[key] || {}), [code]: value } }));

  const handleSave = async () => {
    const broken = Object.keys(edits).flatMap((key) => {
      const r = rows.find((x) => x.key === key);
      if (!r) return [];
      if (!r.values.en?.trim()) return [`${key}: English is required`];
      return codes.filter((c) => c !== 'en' && r.values[c]?.trim() && marks(r.values[c]) !== marks(r.values.en)).map((c) => `${key} (${c}): keep {placeholders} / *highlights*`);
    });
    if (broken.length) {
      toast.error(broken.slice(0, 3).join(' · '));
      return;
    }
    try {
      await saveAll({
        rows: Object.keys(edits)
          .filter((k) => !removed.has(k))
          .map((key) => ({ key, values: rows.find((r) => r.key === key)?.values ?? {} })),
        removeKeys: [...removed],
      }).unwrap();
      toast.success('App texts saved — the app picks them up on its next launch');
      setEdits({});
      setRemoved(new Set());
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save app texts');
    }
  };

  const handleExport = () => {
    const blob = new Blob([`﻿${toCsv(codes, rows)}\n`], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'translations.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleImport = async (file) => {
    if (!file) return;
    const [head, ...body] = parseCsv((await file.text()).replace(/^﻿/, ''));
    const cols = (head || []).slice(1).map((c) => c.trim());
    if (head?.[0]?.trim() !== 'key' || !cols.includes('en')) {
      toast.error('The CSV needs a "key" column followed by language columns (en, fr, …)');
      return;
    }
    const unknown = cols.filter((c) => !codes.includes(c));
    const next = {};
    body.forEach((r) => {
      const key = r[0]?.trim();
      if (!KEY_RE.test(key || '')) return;
      next[key] = Object.fromEntries(cols.filter((c) => codes.includes(c)).map((c, i) => [c, r[cols.indexOf(c) + 1] ?? '']));
    });
    setEdits((e) => ({ ...e, ...next }));
    toast.success(`Loaded ${Object.keys(next).length} rows — review and press Save${unknown.length ? ` (skipped columns: ${unknown.join(', ')}; add those languages first)` : ''}`);
  };

  const headLabel = [
    { id: 'key', label: 'Key', width: 220 },
    ...languages.map((l) => ({ id: l.code, label: `${l.title} (${l.code})${l.missing ? ` · ${l.missing} missing` : ''}` })),
    { id: 'actions', label: '', width: 56 },
  ];

  return (
    <AdminModuleLayout title="App Texts" actionLabel="Add Text" onAction={() => setAdding({ key: '', values: {} })}>
      <Alert severity="info" sx={{ mb: 3 }}>
        Every text the mobile app shows, one row per key and one column per language. Add a key here or in the app&apos;s <b>src/i18n/translations.csv</b> (same columns), fill each
        language and save — the app downloads changes on its next launch. Empty cells show the English text until translated. Use Export / Import to move the table to and from the
        app repo or a spreadsheet.
      </Alert>

      <AdminListingCard
        minWidth={360 + languages.length * 280}
        headLabel={headLabel}
        notFound={!isLoading && filtered.length === 0}
        toolbar={
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} sx={{ p: 2.5 }}>
            <TextField
              size="small"
              placeholder="Search key or text…"
              value={search}
              onChange={(e) => {
                table.onResetPage();
                setSearch(e.target.value);
              }}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" />
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={missingOnly}
                  onChange={(e) => {
                    table.onResetPage();
                    setMissingOnly(e.target.checked);
                  }}
                />
              }
              label="Missing only"
            />
            <Button variant="outlined" startIcon={<Iconify icon="solar:export-bold" />} onClick={handleExport} disabled={!rows.length}>
              Export CSV
            </Button>
            <Button variant="outlined" startIcon={<Iconify icon="solar:import-bold" />} onClick={() => fileRef.current?.click()}>
              Import CSV
            </Button>
            <input
              ref={fileRef}
              hidden
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                handleImport(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            <Button variant="contained" onClick={handleSave} disabled={!dirty || saving}>
              {saving ? 'Saving…' : `Save${dirty ? ` (${dirty})` : ''}`}
            </Button>
          </Stack>
        }
      >
        {isLoading || isFetching ? (
          <TableRow>
            <TableCell colSpan={headLabel.length} sx={{ p: 0 }}>
              <LinearProgress />
            </TableCell>
          </TableRow>
        ) : null}
        {page.map((r) => (
          <TableRow key={r.key} hover sx={{ verticalAlign: 'top', bgcolor: edits[r.key] ? 'rgba(251,146,60,0.06)' : undefined }}>
            <TableCell sx={{ fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all', pt: 2.5 }}>{r.key}</TableCell>
            {codes.map((c) => (
              <TableCell key={c}>
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  maxRows={4}
                  value={r.values[c] ?? ''}
                  placeholder={c === 'en' ? 'English text (required)' : r.values.en}
                  error={!r.values[c]?.trim()}
                  onChange={(e) => setCell(r.key, c, e.target.value)}
                />
              </TableCell>
            ))}
            <TableCell align="center">
              <IconButton color="error" size="small" title="Delete this key from every language" onClick={() => setRemoved((s) => new Set([...s, r.key]))}>
                <Iconify icon="solar:trash-bin-trash-bold" width={18} />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </AdminListingCard>

      <TablePaginationCustom
        page={table.page}
        dense={table.dense}
        count={filtered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
      {rows.some(isMissing) ? null : (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Every key is translated in every language.
        </Typography>
      )}

      <Dialog open={Boolean(adding)} onClose={() => setAdding(null)} fullWidth maxWidth="sm">
        <DialogTitle>Add app text</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Key"
              helperText="Lower-case letters, numbers and _ (the app uses t('this_key'))"
              value={adding?.key ?? ''}
              error={Boolean(adding?.key) && (!KEY_RE.test(adding.key) || rows.some((r) => r.key === adding.key))}
              onChange={(e) => setAdding((a) => ({ ...a, key: e.target.value.trim().toLowerCase() }))}
            />
            {languages.map((l) => (
              <TextField
                key={l.code}
                label={`${l.title} (${l.code})${l.code === 'en' ? ' — required' : ''}`}
                multiline
                value={adding?.values[l.code] ?? ''}
                onChange={(e) => setAdding((a) => ({ ...a, values: { ...a.values, [l.code]: e.target.value } }))}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Box sx={{ flex: 1 }} />
          <Button color="inherit" onClick={() => setAdding(null)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!adding || !KEY_RE.test(adding.key) || rows.some((r) => r.key === adding.key) || !adding.values.en?.trim()}
            onClick={() => {
              setEdits((e) => ({ ...e, [adding.key]: adding.values }));
              setSearch(adding.key);
              setAdding(null);
            }}
          >
            Add (then Save)
          </Button>
        </DialogActions>
      </Dialog>
    </AdminModuleLayout>
  );
}
