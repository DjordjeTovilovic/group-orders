import app from './app';

const port = process.env.PORT || 8000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Server is running at http://0.0.0.0:${port}`);
  /* eslint-enable no-console */
});
