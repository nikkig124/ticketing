import { useState } from 'react';
import axios from 'axios';

const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async (props = {}) => {
        try {
            setErrors(null);
            const response = await axios[method](url, { ...body, ...props });

            if (onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        } catch (err) {
            console.log(err.response.data);
            setErrors(
                <div className='alert alert-danger'>
                    <h4>Oops...</h4>
                    <ul className='my-0'>
                        {err.response.data.errors.map((err, index) => {
                            return <li key={index}>{err.message}</li>;
                        })}
                    </ul>
                </div>,
            );
        }
    };
    return { doRequest, errors };
};
export default useRequest;
