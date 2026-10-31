import PropTypes from 'prop-types';
import { useEffect, useMemo, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import LinearProgress from '@mui/material/LinearProgress';
import InputAdornment from '@mui/material/InputAdornment';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { useGetLanguageTranslationsQuery, useUpdateLanguageTranslationsMutation } from 'src/store/Reducer/language';

// ----------------------------------------------------------------------

const PAGE = 50;

// Same key rule the server applies when saving
const KEY_PATTERN = /^[a-z0-9_]{1,64}$/;

/**
 * Edits the mobile app's texts for one language as a table: one row per text, with the English
 * source next to the translation. English lists every text the app uses; other languages translate
 * each English text. The app downloads a new version on its next launch.
 * Texts can be exported to / imported from a flat JSON file ({ "key": "text" }) for offline translating.
 * Placeholders like {name} and *highlighted* words must be kept.
 */
export function AppTextsDialog({ language, onClose }) {
  const open = Boolean(language);
  const { data, isFetching } = useGetLanguageTranslationsQuery(language?._id, { skip: !open, refetchOnMountOrArgChange: true });
  const [save, { isLoading: saving }] = useUpdateLanguageTranslationsMutation();
  const info = data?.data;
  const isBase = Boolean(info?.isBase);
  const fileInput = useRef(null);
  const [values, setValues] = useState({});
  const [tab, setTab] = useState('missing');
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    if (info) {
      setValues(info.translations || {});
      setTab(info.missing?.length ? 'missing' : 'all');
    }
  }, [info]);

  useEffect(() => setLimit(PAGE), [tab, search]);

  // English is the source: its own rows list every key (including ones added by import);
  // other languages show English next to each field.
  const source = useMemo(() => (info?.isBase ? info?.translations : info?.base) || {}, [info]);
  const keys = useMemo(() => Object.keys(isBase ? { ...source, ...values } : source).sort(), [isBase, source, values]);
  const missing = useMemo(() => keys.filter((k) => !values[k]?.trim()), [keys, values]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (tab === 'missing' ? missing : keys).filter((k) => !q || k.includes(q) || source[k]?.toLowerCase().includes(q) || values[k]?.toLowerCase().includes(q));
  }, [tab, missing, keys, search, source, values]);

  const placeholdersOf = (text = '') => (text.match(/\{\w+\}/g) || []).sort().join(' ');

  const handleExport = () => {
    // Every key is exported (empty when untranslated) so translators can fill the gaps.
    const out = Object.fromEntries(keys.map((k) => [k, values[k] ?? '']));
    const blob = new Blob([`${JSON.stringify(out, null, 2)}\n`], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${language?.code || 'translations'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    let json;
    try {
      json = JSON.parse(await file.text());
    } catch {
      toast.error('That file is not valid JSON');
      return;
    }
    if (!json || typeof json !== 'object' || Array.isArray(json)) {
      toast.error('Expected a JSON object like { "key": "text" }');
      return;
    }

    const next = {};
    let skipped = 0;
    Object.entries(json).forEach(([key, value]) => {
      // Other languages can only translate existing English keys; English may add new ones.
      const known = isBase ? KEY_PATTERN.test(key) : key in source;
      if (!known || typeof value !== 'string') {
        skipped += 1;
        return;
      }
      if (value.trim()) next[key] = value;
    });

    const changed = Object.keys(next).filter((k) => next[k] !== values[k]).length;
    setValues((v) => ({ ...v, ...next }));
    setTab('all');
    toast.success(`Imported ${changed} changed texts${skipped ? `, skipped ${skipped} unknown or invalid keys` : ''}. Review, then Save.`);
  };

  const handleSave = async () => {
    const broken = keys.filter((k) => values[k]?.trim() && placeholdersOf(values[k]) !== placeholdersOf(source[k]));
    if (!isBase && broken.length) {
      toast.error(`Keep the {placeholders} unchanged in: ${broken.slice(0, 3).join(', ')}`);
      return;
    }
    try {
      const res = await save({ id: language._id, translations: values }).unwrap();
      toast.success(res?.data?.missing?.length ? `Saved. ${res.data.missing.length} texts still need translating.` : 'App texts saved');
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save app texts');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg" scroll="paper">
      <DialogTitle>
        App texts · {language?.title}
        <Typography variant="body2" color="text.secondary">
          {isBase
            ? 'English is the source for every language. Edit wording here; new texts are added by app releases.'
            : `Translate each English text. ${language?.title} can be activated once nothing is missing.`}
        </Typography>
      </DialogTitle>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }} sx={{ px: 3, pb: 2 }}>
        {!isBase ? (
          <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ flexShrink: 0 }}>
            <Tab value="missing" label={`Missing (${missing.length})`} />
            <Tab value="all" label={`All (${keys.length})`} />
          </Tabs>
        ) : null}
        <TextField
          size="small"
          fullWidth
          placeholder="Search texts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <Button variant="outlined" color="inherit" startIcon={<Iconify icon="solar:import-bold" />} onClick={() => fileInput.current?.click()} disabled={isFetching}>
            Import JSON
          </Button>
          <Button variant="outlined" color="inherit" startIcon={<Iconify icon="solar:export-bold" />} onClick={handleExport} disabled={isFetching || !keys.length}>
            Export JSON
          </Button>
        </Stack>
        <input ref={fileInput} type="file" accept="application/json,.json" hidden onChange={handleImport} />
      </Stack>

      <DialogContent dividers sx={{ p: 0 }}>
        {isFetching ? <LinearProgress /> : null}
        {!isBase && keys.length === 0 && !isFetching ? (
          <Alert severity="warning" sx={{ m: 2 }}>
            No English app texts yet. Run the translations sync on the server first.
          </Alert>
        ) : null}

        {rows.length === 0 && !isFetching ? (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
            {tab === 'missing' && !search ? 'Everything is translated.' : 'No texts match your search.'}
          </Typography>
        ) : (
          <Table stickyHeader size="small" sx={{ tableLayout: 'fixed', '& td': { verticalAlign: 'top' } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 220 }}>Key</TableCell>
                {!isBase ? <TableCell>English</TableCell> : null}
                <TableCell>{language?.title}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(0, limit).map((key) => (
                <TableRow key={key} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12, color: 'text.secondary', wordBreak: 'break-all', pt: 1.5 }}>{key}</TableCell>
                  {!isBase ? <TableCell sx={{ whiteSpace: 'pre-wrap', pt: 1.5 }}>{source[key]}</TableCell> : null}
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      maxRows={6}
                      value={values[key] ?? ''}
                      error={!isBase && !values[key]?.trim()}
                      placeholder={isBase ? '' : 'Translation'}
                      onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {rows.length > limit ? (
          <Box sx={{ p: 2 }}>
            <Button fullWidth onClick={() => setLimit((l) => l + PAGE)}>
              Show more ({rows.length - limit})
            </Button>
          </Box>
        ) : null}
      </DialogContent>

      <DialogActions>
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          Keep {'{placeholders}'} and *highlighted* words. Version {info?.version ?? 0}
        </Typography>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving || isFetching || !keys.length}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AppTextsDialog.propTypes = {
  language: PropTypes.object,
  onClose: PropTypes.func,
};
