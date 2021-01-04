import React, { useState } from 'react';
import axios from 'axios';

const signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const onSubmit = async event => {
        event.preventDefault();

        try {
            const response = await axios.post('/api/users/signup', {
                email,
                password,
            });

            setEmail('');
            setPassword('');
        } catch (err) {

            setErrors(err.response.data.errors);
        }
    };

    return (
        <div className='container'>
            <form onSubmit={onSubmit}>
                <h1>Sign Up</h1>
                <div className='form-group'>
                    <label>Email</label>
                    <input
                        value={email}
                        type='email'
                        className='form-control'
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <label>Password</label>
                    <input
                        value={password}
                        type='password'
                        className='form-control'
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                {errors.length > 0 && (
                    <div className='alert alert-danger'>
                        <h4>Oops...</h4>
                        <ul className='my-0'>
                            {errors.map((err, index) => {
                                return <li key={index}>{err.message}</li>;
                            })}
                        </ul>
                    </div>
                )}

                <button className='btn btn-primary'>Submit</button>
            </form>
        </div>
    );
};

export default signup;
