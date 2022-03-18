exports.handleErrors = () => {
  const dataErr = {
    status: 500,
    message: "Przepraszamy bład po stronie serwera, spróbuj za kilka minut.",
  };
  return dataErr;
};
