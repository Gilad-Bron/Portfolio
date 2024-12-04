import React, {FC, useState, useEffect, useCallback} from 'react';
import {CssBaseline, Button, TextField} from '@mui/material';
import {Box, Dialog, DialogContent} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import Dayjs from 'dayjs';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import {Vacation} from '../../types'
import {appRoutes} from '../AppRouter/appRoutes'

axios.defaults.withCredentials = true;

interface NewVacationFormProps {
  vacationToEdit?: Vacation;
  loadVacationsProp?: () => void;
  finishEdit?: () => void;
}

interface AddVacationFormErrors {
  destination?: boolean;
  description?: boolean;
  start_date?: boolean;
  end_date?: boolean;
  price?: boolean;
  dateInvalid?: boolean;
}

const trimDate = (str: string | ReturnType<typeof Dayjs>) => Dayjs(str).format('YYYY-MM-DD')

export const VacationForm: FC<NewVacationFormProps> = ({
  vacationToEdit,
  loadVacationsProp,
  finishEdit
}) => {
  const [isAddVacation, setIsAddVacation] = useState<boolean>(true);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<Vacation | null>(vacationToEdit || null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [image, setImage] = useState<any>(null);
  const [addVacationFormErrors, setAddVacationFormErrors] = useState<AddVacationFormErrors>(null);
  const [vacationImage, setVacationImage] = useState<string>(null);

  const handleCancel = () => {
    setIsAddVacation(null);
    setFormData(null);
    setStartDate(null);
    setEndDate(null);
    setImage(null);
    setAddVacationFormErrors(null);
    setIsEditMode(false);
    finishEdit();
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('image', file);

    axios.post('http://localhost:8080/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      setVacationImage(file.name);
    }).catch(error => {
      console.error('Error uploading file:', error);
    });

  }, []);

  const validateAddVacationForm = (formData: Vacation): AddVacationFormErrors => {
    const errors: AddVacationFormErrors = {};

    if (!formData.destination) {
      errors.destination = true;
    }

    if (!formData.description) {
      errors.description = true;
    }

    if (!startDate) {
      errors.start_date = true;
    }

    if (!endDate) {
      errors.end_date = true;
    }

    if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
      errors.dateInvalid = true;
    }

    if (!formData.price) {
      errors.price = true;
    } else if (formData.price <= 0 || formData.price > 10000) {
      errors.price = true;
    }

    return errors;
  };

  const saveVacation = async () => {
    const submittedVacation: Vacation = {
      ...formData,
      start_date: trimDate(startDate),
      end_date: trimDate(endDate),
      image: vacationImage || (
        vacationToEdit ? vacationToEdit.image : 'default.jpg')
    };

    const errors = validateAddVacationForm(submittedVacation);
    if (Object.keys(errors).length > 0) {
      setAddVacationFormErrors(errors);
      return;
    }

    try {
      if (vacationToEdit) {
        await axios.put(appRoutes.api.vacations, submittedVacation);
      } else {
        await axios.post(appRoutes.api.vacations, submittedVacation);
      }
      loadVacationsProp();
      handleCancel();
    } catch (error) {
      console.error('Error saving vacation:', error);
    }
  };

  useEffect(() => {
    if (vacationToEdit) {
      setFormData(vacationToEdit);
      setStartDate(vacationToEdit.start_date);
      setEndDate(vacationToEdit.end_date);
      setIsEditMode(true);
    }
  }, [vacationToEdit]);

  return (
    <>
      <CssBaseline/>
      <Dialog open={isAddVacation} sx={{
        textAlign: 'center',
        minWidth: '500px',
        margin: 'auto'
      }}>
        <DialogContent>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            minWidth: "450px",
            margin: "auto",
            gap: "20px"
          }}>
            <h3
              style={{color: '#1976D2'}}>{isEditMode ? 'Edit Destination' : 'Add New Destination'}</h3>
            <TextField
              error={addVacationFormErrors?.destination}
              id="outlined-error-helper-text-first-name"
              label="Destination"
              defaultValue={vacationToEdit?.destination}
              helperText={addVacationFormErrors?.destination ? 'Please enter a destination' : ''}
              onChange={(e) => setFormData({
                ...formData,
                destination: e.target.value
              })}
              inputMode='text'
            />
            <TextField
              error={addVacationFormErrors?.description}
              id="outlined-error-helper-text-last-name"
              label="Description"
              defaultValue={vacationToEdit?.description}
              helperText={addVacationFormErrors?.description ? 'Please enter a description' : ''}
              onChange={(e) => setFormData({
                ...formData,
                description: e.target.value
              })}
              inputMode='text'
              multiline={true}
              rows={4}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                onChange={startDate => {
                  setStartDate(trimDate(startDate))
                }}
                value={Dayjs(startDate)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    required: true,
                    error: addVacationFormErrors?.start_date,
                    helperText: addVacationFormErrors?.start_date ? 'Please enter a start date' : '',
                  },
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                onChange={endDate => {
                  setEndDate(trimDate(endDate))
                }}
                value={Dayjs(endDate)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    required: true,
                    error: addVacationFormErrors?.end_date || addVacationFormErrors?.dateInvalid,
                    helperText: addVacationFormErrors?.dateInvalid ? 'Invalid End Date (must not be earlier than Start Date)'
                      : addVacationFormErrors?.end_date ? 'Please enter an end date' : '',
                  },
                }}
              />
            </LocalizationProvider>
            <TextField
              error={addVacationFormErrors?.price}
              id="outlined-error-helper-text-email"
              label="Price (USD)"
              defaultValue={formData?.price}
              helperText={addVacationFormErrors?.price ? 'Please enter a valid price (up to $10,000)' : ''}
              onChange={(e) => setFormData({
                ...formData,
                price: Number(e.target.value)
              })}
              inputMode='numeric'
            />
            <Dropzone onDrop={onDrop}>
              {({
                getRootProps,
                getInputProps
              }) => (
                <div {...getRootProps()} style={{
                  border: '2px dashed #cccccc',
                  borderRadius: '5px',
                  padding: '20px',
                  textAlign: 'center',
                  backgroundImage: image ? `url(${image})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: 'pointer'
                }}>
                  <input {...getInputProps()} />
                  {image ? <p style={{
                    color: 'white',
                    textShadow: '1px 1px 2px black'
                  }}>Click to change the image</p> : <p style={{
                    color: 'white',
                    textShadow: '1px 1px 2px black'
                  }}>Drag and drop an image here, or click to select one</p>}
                </div>
              )}
            </Dropzone>
          </Box>
          <Button variant="contained" onClick={() => saveVacation()} sx={{
            margin: 'auto',
            p: 1,
            mt: '16px'
          }}>{isEditMode ? 'Save' : 'Add'}</Button>
          <Button variant="contained" onClick={handleCancel} sx={{
            margin: 'auto',
            p: 1,
            mt: '16px',
            ml: '8px '
          }}>Cancel</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
