require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { getAppointmentById, fetchAppointments, createAppointment, updateAppointment, getAppointmentTypes, deleteAppointment } = require('./dao');  // Adjust the path as necessary

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

// Endpoint to get appointments, filtering by email
app.get('/appointments', async (req, res) => {
    try {
        const { upcoming, email } = req.query;
        if (!email) {
            return res.status(400).send('Email query parameter is required');
        }

        const appointments = await fetchAppointments(upcoming, email);
        
        res.status(200).send(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send(error.message);
    }
});

app.get('/appointments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await getAppointmentById(id);
        if (appointment === null) {
            return res.status(404).send({ message: 'Appointment not found' });
        }
        res.status(200).send(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.put('/appointments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedAppointment = await updateAppointment(id, req.body);

        if (updatedAppointment === null) {
            return res.status(404).send({ message: 'Appointment not found' });
        }

        res.status(200).send(updatedAppointment);
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.delete('/appointments/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAppointment = await deleteAppointment(id, req.body);

        if (deletedAppointment === null) {
            return res.status(404).send({ message: 'Appointment not found' });
        }

        res.status(202).send(deletedAppointment);
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.post('/create-appointment', async (req, res) => {
    try {
        const newAppointment = await createAppointment(req.body);
        res.status(201).send(newAppointment);
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.get('/appointment-types', (req, res) => {
    try {
        const services = getAppointmentTypes();
        res.status(200).send(services);
    } catch (error) {
        console.error('Error fetching appointment types:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
