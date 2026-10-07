import { LoadingButton } from '@mui/lab';
import { Alert, Box, LinearProgress, Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled, useTheme } from '@mui/material/styles';
import { useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { LoadingScreen } from 'src/components/loading-screen';
import { toast } from 'src/components/snackbar';

import {
  useGetAboutUsQuery,
  useGetPrivacyPolicyQuery,
  useGetTermsAndConditionsQuery,
  useUpdateAboutUsMutation,
  useUpdatePrivacyPolicyMutation,
  useUpdateTermsAndConditionsMutation,
} from 'src/store/Reducer/settings';

// ----------------------------------------------------------------------

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

export default function LegalView({ type }) {
  const theme = useTheme();

  const [textEn, setTextEn] = useState('');
  const [errorEn, setErrorEn] = useState('');

  // ----------------------------------------------------------------------
  // Queries

  const aboutQuery = useGetAboutUsQuery(undefined, {
    skip: type !== 'about',
  });

  const termsQuery = useGetTermsAndConditionsQuery(undefined, {
    skip: type !== 'terms',
  });

  const policyQuery = useGetPrivacyPolicyQuery(undefined, {
    skip: type !== 'policy',
  });

  const query = useMemo(() => {
    switch (type) {
      case 'about':
        return aboutQuery;
      case 'terms':
        return termsQuery;
      default:
        return policyQuery;
    }
  }, [type, aboutQuery, termsQuery, policyQuery]);

  const { data, isLoading, isFetching, refetch } = query;

  // ----------------------------------------------------------------------
  // Mutations

  const [updateAbout, { isLoading: aboutUpdating }] = useUpdateAboutUsMutation();

  const [updateTerms, { isLoading: termsUpdating }] = useUpdateTermsAndConditionsMutation();

  const [updatePolicy, { isLoading: policyUpdating }] = useUpdatePrivacyPolicyMutation();

  const isUpdating = aboutUpdating || termsUpdating || policyUpdating;

  // ----------------------------------------------------------------------

  useEffect(() => {
    if (!data) return;

    setTextEn(data?.data?.content || '');
    setErrorEn('');
  }, [data]);

  // ----------------------------------------------------------------------

  const validateContent = (content) => {
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    return plainText.length > 0;
  };

  const handleChange = (value) => {
    setTextEn(value);

    if (errorEn) {
      setErrorEn('');
    }
  };

  // ----------------------------------------------------------------------

  const handleSave = async () => {
    if (!validateContent(textEn)) {
      setErrorEn('Please enter content.');
      return;
    }

    const payload = {
      title: type === 'about' ? 'About Us' : type === 'terms' ? 'Terms & Conditions' : 'Privacy Policy',
      content: textEn,
    };

    try {
      if (type === 'about') {
        await updateAbout(payload).unwrap();
      } else if (type === 'terms') {
        await updateTerms(payload).unwrap();
      } else {
        await updatePolicy(payload).unwrap();
      }

      toast.success('Updated successfully');

      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error?.data?.translationKey || 'Failed to update.');
    }
  };

  // ----------------------------------------------------------------------

  const quillModules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  const quillFormats = ['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'align', 'link', 'image', 'video'];


  return (
    <Box
      sx={{
        px: { xs: 2, md: 6 },
        pb: 5,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {isFetching && (
        <LinearProgress
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9,
          }}
        />
      )}
      <StyledPaper
        elevation={3}
        sx={{
          '.ql-toolbar': {
            backgroundColor: theme.palette.mode === 'dark' ? '#fff' : undefined,
            borderTopLeftRadius: 4,
            borderTopRightRadius: 4,
          },

          '.ql-container': {
            minHeight: 320,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
          },
        }}
      >
        <ReactQuill theme="snow" value={textEn} onChange={handleChange} modules={quillModules} formats={quillFormats} placeholder="Enter content..." />
      </StyledPaper>

      {errorEn && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorEn}
        </Alert>
      )}

      <Stack direction="row" justifyContent="flex-end">
        <LoadingButton variant="contained" loading={isUpdating} onClick={handleSave}>
          Save {type === 'about' ? 'About Us' : type === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
        </LoadingButton>
      </Stack>
    </Box>
  );
}


