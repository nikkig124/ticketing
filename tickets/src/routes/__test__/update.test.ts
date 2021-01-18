import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'sdfsd',
            price: 20,
        })
        .expect(404);
});

it('returns 401 if users is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'sdfsd',
            price: 20,
        })
        .expect(401);
});

it('returns 401 if users does not own ticket', async () => {
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', global.signin())
        .send({
            title: 'sdfsd',
            price: 20,
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'hihi',
            price: 20,
        })
        .expect(401);
});

it('returns 400 if invalid title / price', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'sdfsd',
            price: 20,
        });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'sdfd',
            price: -120,
        })
        .expect(400);
});

it('updates ticket provided valid inputs and authentication', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'sdfsd',
            price: 20,
        });

    const title = 'new title';
    const price = 20;
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title,
            price,
        })
        .expect(200);

    const getTicket = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send({})
        .expect(200);

    expect(getTicket.body.title).toEqual(title);
    expect(getTicket.body.price).toEqual(price);

});

it('publishes event after ticket updated', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post(`/api/tickets`)
        .set('Cookie', cookie)
        .send({
            title: 'sdfsd',
            price: 20,
        });

    const title = 'new title';
    const price = 20;
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title,
            price,
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
