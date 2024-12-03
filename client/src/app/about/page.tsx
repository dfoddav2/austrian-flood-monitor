import React from 'react';

const About = () => {
    return (
        <div
            style={{
                padding: '20px',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.6',
                color: '#333',
                backgroundColor: '#f9f9f9',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                maxWidth: '800px',
                margin: '30px auto', 
            }}
        >
            <h1
                style={{
                    color: '#0056b3',
                    textAlign: 'center',
                    marginBottom: '20px',
                    fontWeight: 'bold', 
                    fontSize: '2.5rem', 
                }}
            >
                About Austrian Flood Monitoring
            </h1>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '20px',
                }}
            >
                <img
                    src="https://s39920.pcdn.co/wp-content/uploads/2022/03/Lightning-Fire-2020.jpg"
                    alt="Flood Monitoring"
                    style={{
                        width: '100%',
                        maxWidth: '600px',
                        height: '500px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                />
            </div>
            <p
                style={{
                    fontSize: '1.2rem',
                    marginBottom: '20px',
                    textAlign: 'justify',
                }}
            >
                Welcome to the Austrian Flood Monitoring and Emergency Response System! Our platform helps
                emergency response organizations monitor flooding events, plan their response, and coordinate
                effectively.
            </p>
            <h2
                style={{
                    color: '#0056b3',
                    marginBottom: '15px',
                    fontWeight: 'bold', 
                    fontSize: '1.8rem', 
                }}
            >
                Our Mission
            </h2>
            <p
                style={{
                    fontSize: '1.1rem',
                    marginBottom: '20px',
                    textAlign: 'justify',
                }}
            >
                We aim to provide real-time data and tools to mitigate flood risks, enabling communities to
                stay informed and prepared.
            </p>
            <h2
                style={{
                    color: '#0056b3',
                    marginBottom: '15px',
                    fontWeight: 'bold',
                    fontSize: '1.8rem',
                }}
            >
                Features
            </h2>
            <ul
                style={{
                    paddingLeft: '20px',
                    listStyleType: 'disc',
                    fontSize: '1.1rem',
                    marginBottom: '20px',
                }}
            >
                <li>Visualize water levels and critical areas.</li>
                <li>Access historical data and trends.</li>
                <li>Report and visualize emergency situations.</li>
                <li>Plan emergency responses with geolocation features.</li>
            </ul>
            <p
                style={{
                    marginTop: '20px',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    fontSize: '1rem',
                }}
            >
                Together, we can build safer communities and minimize flood risks.
            </p>
        </div>
    );
};

export default About;
