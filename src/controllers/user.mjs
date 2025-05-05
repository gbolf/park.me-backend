export const getProfile = (req, res) => {
  const user = req.user;
  res.send({
    success: true,
    user: {
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImage: user.profileImage,
      role: user.role,
      parkings: user.parkings,
    },
  });
};
