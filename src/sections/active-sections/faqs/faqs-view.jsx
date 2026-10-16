import { useCallback, useMemo, useState } from 'react';
import { z as zod } from 'zod';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';

import AddFaqDialog from './components/add-faq-dialog';
import EditFaqDialog from './components/edit-faq-dialog';

import { useGetFaqsQuery, useCreateFaqsMutation, useUpdateFaqsMutation, useDeleteFaqsMutation } from 'src/store/Reducer/settings';
import { LinearProgress } from '@mui/material';

// ----------------------------------------------------------------------

const FaqSchema = zod.object({
  question: zod.string().trim().min(1, {
    message: 'Question is required!',
  }),

  answer: zod.string().trim().min(1, {
    message: 'Answer is required!',
  }),
});

// ----------------------------------------------------------------------

export function FaqsView() {
  const addDialog = useBoolean();
  const editDialog = useBoolean();
  const confirmDelete = useBoolean();
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [faqToDelete, setFaqToDelete] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const queryParams = useMemo(() => ({ page: 1, limit: 100 }), []);

  const { data, isLoading, isFetching } = useGetFaqsQuery(queryParams);

  const [createFaq, { isLoading: isCreating }] = useCreateFaqsMutation();

  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqsMutation();

  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqsMutation();

  // ----------------------------------------------------------------------

  const faqs = data?.data || [];

  const handleAccordionChange = useCallback(
    (panel) => (_, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    },
    []
  );

  const handleAddFaq = useCallback(
    async (values) => {
      try {
        await createFaq({
          question: values.question.trim(),
          answer: values.answer.trim(),
        }).unwrap();

        toast.success('FAQ created successfully.');

        addDialog.onFalse();
      } catch (error) {
        toast.error(error?.data?.message || error?.data?.translationKey || 'Failed to create FAQ.');
      }
    },
    [createFaq, addDialog]
  );

  const handleEditFaq = useCallback(
    (faq) => {
      setSelectedFaq(faq);
      editDialog.onTrue();
    },
    [editDialog]
  );

  const handleUpdateFaq = useCallback(
    async (values) => {
      if (!selectedFaq) return;

      try {
        await updateFaq({
          id: selectedFaq._id,
          question: values.question.trim(),
          answer: values.answer.trim(),
        }).unwrap();

        toast.success('FAQ updated successfully.');

        editDialog.onFalse();

        setSelectedFaq(null);
      } catch (error) {
        toast.error(error?.data?.message || error?.data?.translationKey || 'Failed to update FAQ.');
      }
    },
    [selectedFaq, updateFaq, editDialog]
  );

  const handleAskDelete = useCallback(
    (faq) => {
      setFaqToDelete(faq);
      confirmDelete.onTrue();
    },
    [confirmDelete]
  );

  const handleCloseDeleteDialog = useCallback(() => {
    setFaqToDelete(null);
    confirmDelete.onFalse();
  }, [confirmDelete]);

  const handleDeleteFaq = useCallback(async () => {
    if (!faqToDelete) return;

    try {
      await deleteFaq(faqToDelete._id).unwrap();

      toast.success('FAQ deleted successfully.');

      if (expanded === faqToDelete._id) {
        setExpanded(false);
      }

      handleCloseDeleteDialog();
    } catch (error) {
      toast.error(error?.data?.message || error?.data?.translationKey || 'Failed to delete FAQ.');
    }
  }, [faqToDelete, deleteFaq, expanded, handleCloseDeleteDialog]);

  if (isLoading || isFetching) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9,
          }}
        />
      </Stack>
    );
  }

  return (
    <>
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          pt: 3,
          pb: 5,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomBreadcrumbs
          heading="FAQs"
          links={[
            {
              name: 'Dashboard',
              href: paths.adminDashboard.root,
            },
            {
              name: 'FAQs',
            },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />} onClick={addDialog.onTrue}>
              Add FAQ
            </Button>
          }
          sx={{ mb: 4 }}
        />

        <Stack spacing={1.5} sx={{ mb: 4 }}>
          <Typography variant="h5">Manage Frequently Asked Questions</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Create, update and delete FAQs shown in the mobile application.
          </Typography>
        </Stack>

        {faqs.length === 0 ? (
          <Stack
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{
              py: 10,
              borderRadius: 2,
              bgcolor: 'background.neutral',
            }}
          >
            <Iconify icon="solar:question-circle-bold" width={42} sx={{ color: 'text.disabled' }} />

            <Typography variant="h6">No FAQs found</Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Click "Add FAQ" to create your first FAQ.
            </Typography>
          </Stack>
        ) : (
          <Stack spacing={2}>
            {faqs.map((faq, index) => (
              <Accordion key={faq._id} expanded={expanded === faq._id} onChange={handleAccordionChange(faq._id)}>
                <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ width: 1 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="overline"
                        sx={{
                          color: 'text.disabled',
                        }}
                      >
                        FAQ {index + 1}
                      </Typography>

                      <Typography variant="subtitle1">{faq.question}</Typography>
                    </Box>

                    <Stack direction="row">
                      <IconButton
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditFaq(faq);
                        }}
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAskDelete(faq);
                        }}
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}
      </Box>

      <AddFaqDialog open={addDialog.value} onClose={addDialog.onFalse} onSubmit={handleAddFaq} schema={FaqSchema} loading={isCreating} />

      <EditFaqDialog
        open={editDialog.value}
        onClose={() => {
          editDialog.onFalse();
          setSelectedFaq(null);
        }}
        faq={selectedFaq}
        onSubmit={handleUpdateFaq}
        schema={FaqSchema}
        loading={isUpdating}
      />

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={handleCloseDeleteDialog}
        title="Delete FAQ"
        content={
          <>
            Are you sure you want to delete <strong>{faqToDelete?.question}</strong>?
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteFaq} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </>
  );
}
