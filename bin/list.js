exports.types = [
  { name: 'Alshaya', url: '/alshay' },
  { name: 'Nestle', url: '/nestle' },
  { name: 'Hello', url: '/hello' }
];

exports.showProjects = exports.types.map(function (item) {
  return item.name + item.url;
})

