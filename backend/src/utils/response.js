const ok = (res, data, message = 'OK') => res.status(200).json({ message, data });
const created = (res, data, message = 'Created') => res.status(201).json({ message, data });

module.exports = {
  ok,
  created,
};
