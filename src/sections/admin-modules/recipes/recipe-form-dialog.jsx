import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

import { Iconify } from 'src/components/iconify';
import { useGetCountriesQuery } from 'src/store/Reducer/country';
import { ADMIN_AGE_GROUPS, ADMIN_NUTRITION_TAGS } from 'src/_mock/admin-nomnom';

import { AdminDialogActions, AdminFormDialog } from '../components/admin-form-dialog';
import { UploadAvatar } from 'src/components/upload';
import { useGetBabyStagesQuery } from 'src/store/Reducer/babyStage';
import { useGetNutritionsQuery } from 'src/store/Reducer/nutrition';
import { useGetMealsQuery } from 'src/store/Reducer/meals';
import { useUploadFilesMutation } from 'src/store/Reducer/upload';
import { toast } from 'src/components/snackbar';
import { LinearProgress } from '@mui/material';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

const emptyIngredient = { name: '', icon: '', category: '', quantity: '' };
const emptyMethodStep = { title: '', instruction: '' };

const defaultForm = {
  title: '',
  icon: '',
  image: '',
  country: '',
  babyStage: '',
  prepTime: '',
  mealType: '',
  nutritionTags: [],
  feedingInsight: '',
  allergyReminder: '',
  ingredients: [emptyIngredient],
  method: [emptyMethodStep],
  notes: '',
  acceptanceLabel: '',
  status: 'published',
};

// ----------------------------------------------------------------------

export function RecipeFormDialog({ open, onClose, onSubmit, initialData, loadingInitialData, title, submitting }) {
  const [form, setForm] = useState(defaultForm);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadFiles] = useUploadFilesMutation();

  const { data: countriesResponse } = useGetCountriesQuery({ page: 1, limit: 200, enabled: true }, { skip: !open });
  // Dropdown options are only loaded once the dialog is opened.
  const countryOptions = countriesResponse?.data ?? [];

  const { data: babyStageResponse } = useGetBabyStagesQuery(
    {
      page: 1,
      limit: 100,
      status: 'active',
    },
    { skip: !open }
  );
  const babyStageOptions = babyStageResponse?.data ?? [];

  const { data: nutritionTagsResponse } = useGetNutritionsQuery(
    {
      page: 1,
      limit: 100,
      status: 'active',
    },
    { skip: !open }
  );
  const nutritionOptions = nutritionTagsResponse?.data ?? [];

  const { data: mealsResponse } = useGetMealsQuery(
    {
      page: 1,
      limit: 100,
      status: 'active',
    },
    { skip: !open }
  );
  const mealTypeOptions = mealsResponse?.data ?? [];

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              title: initialData.title,
              icon: initialData.icon ?? '',
              image: initialData.image ?? '',
              country: initialData.country?._id ?? initialData.country ?? '',
              babyStage: initialData.babyStage?._id ?? initialData.babyStage ?? '',
              prepTime: initialData.prepTime != null ? String(initialData.prepTime) : '',
              mealType: initialData.mealType?._id ?? initialData.mealType ?? '',
              nutritionTags: initialData.nutritionTags || [],
              feedingInsight: initialData.feedingInsight ?? '',
              allergyReminder: initialData.allergyReminder ?? '',
              ingredients: initialData.ingredients?.length
                ? initialData.ingredients.map((i) => ({ name: i.name ?? '', icon: i.icon ?? '', category: i.category ?? '', quantity: i.quantity ?? '' }))
                : [emptyIngredient],
              method: initialData.method?.length ? [...initialData.method].sort((a, b) => a.step - b.step).map((m) => ({ title: m.title ?? '', instruction: m.instruction ?? '' })) : [emptyMethodStep],
              notes: initialData.notes ?? '',
              acceptanceLabel: initialData.acceptanceLabel ?? '',
              status: initialData.status ?? 'draft',
            }
          : defaultForm
      );
    }
  }, [open, initialData]);

  const handleDropImage = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles?.[0];
      if (!file) return;

      const previousImage = form.image;
      setForm((f) => ({ ...f, image: URL.createObjectURL(file) }));

      setUploadingImage(true);
      try {
        const res = await uploadFiles(file).unwrap();
        const uploaded = Array.isArray(res?.data) ? res.data[0] : res?.data;
        setForm((f) => ({ ...f, image: uploaded.fileUrl }));
      } catch (err) {
        setForm((f) => ({ ...f, image: previousImage }));
        toast.error(err?.data?.message || 'Image upload failed');
      } finally {
        setUploadingImage(false);
      }
    },
    [form.image, uploadFiles]
  );

  const updateIngredient = (index, field, value) => {
    setForm((f) => ({
      ...f,
      ingredients: f.ingredients.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)),
    }));
  };

  const addIngredient = () => {
    setForm((f) => ({ ...f, ingredients: [...f.ingredients, { ...emptyIngredient }] }));
  };

  const removeIngredient = (index) => {
    setForm((f) => ({ ...f, ingredients: f.ingredients.filter((_, i) => i !== index) }));
  };

  const updateMethodStep = (index, field, value) => {
    setForm((f) => ({
      ...f,
      method: f.method.map((step, i) => (i === index ? { ...step, [field]: value } : step)),
    }));
  };

  const addMethodStep = () => {
    setForm((f) => ({ ...f, method: [...f.method, { ...emptyMethodStep }] }));
  };

  const removeMethodStep = (index) => {
    setForm((f) => ({ ...f, method: f.method.filter((_, i) => i !== index) }));
  };

  const handleSubmit = () => {
    if (!isValid) return;

    const cleanedIngredients = form.ingredients
      .filter((i) => i.name.trim())
      .map((i) => ({ name: i.name.trim(), icon: i.icon.trim(), category: i.category.trim(), quantity: i.quantity.trim() }));

    const cleanedMethod = form.method.filter((m) => m.instruction.trim()).map((m, index) => ({ step: index + 1, title: m.title.trim(), instruction: m.instruction.trim() }));

    onSubmit({
      title: form.title.trim(),
      icon: form.icon.trim(),
      image: form.image,
      country: form.country,
      babyStage: form.babyStage,
      prepTime: Number(form.prepTime) || 0,
      mealType: form.mealType,
      nutritionTags: form.nutritionTags.map((tag) => tag._id),
      feedingInsight: form.feedingInsight.trim(),
      allergyReminder: form.allergyReminder.trim(),
      ingredients: cleanedIngredients,
      method: cleanedMethod,
      notes: form.notes.trim(),
      acceptanceLabel: form.acceptanceLabel.trim(),
      status: form.status,
    });
  };

  const isValid = form.title.trim() && form.country && form.babyStage && form.ingredients.some((i) => i.name.trim()) && form.method.some((m) => m.instruction.trim());

  return (
    <AdminFormDialog open={open} onClose={onClose} title={title} maxWidth="md">
      <DialogContent sx={{ position: 'relative' }}>
        {loadingInitialData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9,
              }}
            />
          </Box>
        ) : (
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Stack alignItems="center" sx={{ mb: 1 }}>
              <UploadAvatar
                value={form.image}
                onDrop={handleDropImage}
                helperText={
                  <Typography variant="caption" sx={{ mt: 1, mx: 'auto', display: 'block', textAlign: 'center', color: 'text.disabled' }}>
                    {uploadingImage ? 'Uploading…' : 'Allowed *.jpeg, *.jpg, *.png, *.gif. Max size 3MB'}
                  </Typography>
                }
              />
            </Stack>

            <TextField
              label="Recipe title"
              placeholder="e.g. Plantain, Apple & Egg Yolk Puree"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              fullWidth
            />
            <TextField label="Recipe Icon" placeholder="🍎" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} fullWidth />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField select label="Country" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} fullWidth>
                {countryOptions.map((country) => (
                  <MenuItem key={country._id} value={country._id}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField select label="Age group" value={form.babyStage} onChange={(e) => setForm((f) => ({ ...f, babyStage: e.target.value }))} fullWidth>
                {babyStageOptions.map((stage) => (
                  <MenuItem key={stage._id} value={stage._id}>
                    {stage.title}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField select label="Meal Types" value={form.mealType} onChange={(e) => setForm((f) => ({ ...f, mealType: e.target.value }))} fullWidth>
                {mealTypeOptions.map((meal) => (
                  <MenuItem key={meal._id} value={meal._id}>
                    {meal.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Prep time (minutes)"
                type="number"
                placeholder="e.g. 15"
                value={form.prepTime}
                onChange={(e) => setForm((f) => ({ ...f, prepTime: e.target.value }))}
                fullWidth
              />
              <TextField select label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} fullWidth>
                {STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Ingredients</Typography>
              {form.ingredients.map((ingredient, index) => (
                <Stack key={index} direction="row" spacing={1.5} alignItems="center">
                  <TextField label="Icon" placeholder="🎃" value={ingredient.icon} onChange={(e) => updateIngredient(index, 'icon', e.target.value)} sx={{ width: 90 }} />
                  <TextField label="Name" placeholder="e.g. Pumpkin" value={ingredient.name} onChange={(e) => updateIngredient(index, 'name', e.target.value)} fullWidth />
                  <TextField
                    label="Category"
                    placeholder="e.g. Vegetable"
                    value={ingredient.category}
                    onChange={(e) => updateIngredient(index, 'category', e.target.value)}
                    sx={{ width: 160 }}
                  />
                  <TextField
                    label="Quantity"
                    placeholder="e.g. 1 cup"
                    value={ingredient.quantity}
                    onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                    sx={{ width: 160 }}
                  />
                  <IconButton color="error" onClick={() => removeIngredient(index)} disabled={form.ingredients.length === 1}>
                    <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                  </IconButton>
                </Stack>
              ))}
              <Button startIcon={<Iconify icon="mingcute:add-line" />} onClick={addIngredient} sx={{ alignSelf: 'flex-start' }}>
                Add ingredient
              </Button>
            </Stack>

            <Divider />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Method</Typography>
              {form.method.map((step, index) => (
                <Stack key={index} direction="row" spacing={1.5} alignItems="flex-start">
                  <Typography sx={{ pt: 1.5, minWidth: 24, color: 'text.secondary' }}>{index + 1}.</Typography>
                  <Stack spacing={1} sx={{ flex: 1 }}>
                    <TextField size="small" placeholder="Step title (e.g. Steam the apple)" value={step.title} onChange={(e) => updateMethodStep(index, 'title', e.target.value)} inputProps={{ maxLength: 80 }} fullWidth />
                    <TextField placeholder="Describe this step" value={step.instruction} onChange={(e) => updateMethodStep(index, 'instruction', e.target.value)} multiline fullWidth />
                  </Stack>
                  <IconButton color="error" onClick={() => removeMethodStep(index)} disabled={form.method.length === 1}>
                    <Iconify icon="solar:trash-bin-trash-bold" width={20} />
                  </IconButton>
                </Stack>
              ))}
              <Button startIcon={<Iconify icon="mingcute:add-line" />} onClick={addMethodStep} sx={{ alignSelf: 'flex-start' }}>
                Add step
              </Button>
            </Stack>

            <Divider />

            <Autocomplete
              multiple
              options={nutritionOptions}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              value={form.nutritionTags}
              onChange={(_, value) =>
                setForm((prev) => ({
                  ...prev,
                  nutritionTags: value,
                }))
              }
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return <Chip key={key} label={option.name} size="small" {...tagProps} />;
                })
              }
              renderInput={(params) => <TextField {...params} label="Nutrition tags" placeholder="Type a tag and press Enter" />}
            />

            <TextField
              label="Feeding Insight"
              value={form.feedingInsight}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  feedingInsight: e.target.value,
                }))
              }
              multiline
              minRows={2}
              fullWidth
            />

            <TextField
              label="Allergy Reminder"
              value={form.allergyReminder}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  allergyReminder: e.target.value,
                }))
              }
              multiline
              minRows={2}
              fullWidth
            />

            <TextField
              label="Notes"
              placeholder="Any additional notes for caregivers"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              multiline
              minRows={2}
              fullWidth
            />

            <TextField
              label="Acceptance labels"
              placeholder="e.g. Gentle on Tummy"
              value={form.acceptanceLabel}
              onChange={(e) => setForm((f) => ({ ...f, acceptanceLabel: e.target.value }))}
              fullWidth
            />
          </Stack>
        )}
      </DialogContent>
      <AdminDialogActions onCancel={onClose} onSubmit={handleSubmit} submitDisabled={!isValid || submitting || loadingInitialData || uploadingImage} loading={submitting} />
    </AdminFormDialog>
  );
}

RecipeFormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  initialData: PropTypes.object,
  loadingInitialData: PropTypes.bool,
  title: PropTypes.string,
  submitting: PropTypes.bool,
};
