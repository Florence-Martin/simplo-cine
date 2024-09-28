// import request from 'supertest';
// import app from '../src/index';  // Assure-toi que le chemin est correct

// describe('Test des routes de films', () => {
//   let testMovieId: number;

//   beforeAll(async () => {
//     // Préparer des données ou configurer des choses avant tous les tests
//   });

//   afterAll(async () => {
//     // Nettoyer les données ou fermer les connexions après tous les tests
//   });

//   it('Devrait créer un nouveau film', async () => {
//     const response = await request(app).post('/movies').send({
//       title: 'Test Movie',
//       description: 'Test Description',
//       releaseDate: '2024-01-01',
//       duration: 120,
//     });
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty('id');
//     expect(response.body.title).toBe('Test Movie');
//     testMovieId = response.body.id;
//   });

//   it('Devrait retourner la liste des films', async () => {
//     const response = await request(app).get('/movies');
//     expect(response.status).toBe(200);
//     expect(Array.isArray(response.body)).toBe(true);
//     expect(response.body.length).toBeGreaterThan(0);
//   });

//   it('Devrait retourner un film par son ID', async () => {
//     const response = await request(app).get(`/movies/${testMovieId}`);
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id', testMovieId);
//     expect(response.body.title).toBe('Test Movie');
//   });

//   it('Devrait mettre à jour un film existant', async () => {
//     const response = await request(app).put(`/movies/${testMovieId}`).send({
//       title: 'Updated Movie',
//       description: 'Updated Description',
//       releaseDate: '2024-01-01',
//       duration: 130,
//     });
//     expect(response.status).toBe(200);
//     const updatedMovieResponse = await request(app).get(`/movies/${testMovieId}`);
//     expect(updatedMovieResponse.status).toBe(200);  // Assure-toi que la réponse est bien 200 après la mise à jour
//     expect(updatedMovieResponse.body.title).toBe('Updated Movie');
//   });

//   it('Devrait supprimer un film', async () => {
//     const response = await request(app).delete(`/movies/${testMovieId}`);
//     expect(response.status).toBe(204);
//     const getMovieResponse = await request(app).get(`/movies/${testMovieId}`);
//     expect(getMovieResponse.status).toBe(404);
//   });
// });
