import React, { useEffect, useState } from 'react';
import { getUpcomingAppointments, cancelAppointment } from '../services/appointmentService';
import { services } from '../serviceData';
import { List, ListItem, ListItemText, Typography, Paper, Avatar, ListItemAvatar, Divider, ListItemSecondaryAction, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CancelIcon from '@mui/icons-material/Cancel';
import { format } from 'date-fns';

// Convert service values to labels for display
const getServiceLabel = (serviceValue) => {
    const service = services.find(s => s.value === serviceValue);
    return service ? service.label : serviceValue; // Fallback to the value if not found
};

const UpcomingAppointments = ({ email, triggerRefresh }) => {
    const [appointments, setAppointments] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!email) return;

            try {
                const upcomingAppointments = await getUpcomingAppointments(email);
                setAppointments(upcomingAppointments);
            } catch (error) {
                console.error('Failed to fetch appointments:', error);
            }
        };

        fetchAppointments();
    }, [email, triggerRefresh]);

    const handleOpenDialog = (appointment) => {
        setAppointmentToCancel(appointment);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setAppointmentToCancel(null);
    };

    const onCancel = async () => {
        if (!appointmentToCancel) return;

        try {
            await cancelAppointment(appointmentToCancel.id);
            setAppointments((prevAppointments) =>
                prevAppointments.filter((appointment) => appointment.id !== appointmentToCancel.id)
            );
            handleCloseDialog();
        } catch (error) {
            console.error('Failed to cancel appointment:', error);
        }
    };

    if (appointments.length === 0) {
        return (
            <Typography variant="subtitle1" style={{ marginTop: 20, textAlign: 'center' }}>
                No upcoming appointments. Take a moment to book one!
            </Typography>
        );
    }

    return (
        <Paper style={{ margin: 16, maxWidth: 600, width: '100%' }}>
            <List>
                {appointments.map((appointment, index) => (
                    <React.Fragment key={index}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar sx={{ backgroundColor: '#1B4571' }}>
                                    <CalendarTodayIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={getServiceLabel(appointment.service)}
                                secondary={`On ${format(new Date(appointment.appointmentDate), 'MMMM d, yyyy, h:mm a')} for ${appointment.name}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="cancel"
                                    onClick={() => handleOpenDialog(appointment)}
                                    sx={{ color: '#BF2051' }} // Apply custom color
                                >
                                    <CancelIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        {index < appointments.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Cancellation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to cancel this appointment?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button
                    onClick={handleCloseDialog}
                    sx={{
                        color: '#1B4571',
                        backgroundColor: '#fff',
                        border: '1px solid #1B4571',
                        '&:hover': {
                            backgroundColor: '#f0f0f0', // Slightly darker shade for hover effect
                        },
                    }}
                >
                    No
                </Button>
                <Button
                    onClick={onCancel}
                    sx={{
                        backgroundColor: '#D21717', // Light red background
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: '#A60000', // Darker shade for hover effect
                        },
                    }}
                    autoFocus
                >
                    Yes
                </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default UpcomingAppointments;