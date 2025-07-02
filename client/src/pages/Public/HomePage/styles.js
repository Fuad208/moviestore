export default theme => ({
  root: {
    marginTop: theme.spacing(12),
    padding: theme.spacing(4),
    color: 'white'
  },
  card: {
    background: '#1c1c1c',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 0 15px rgba(0,0,0,0.5)',
    color: 'white',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)'
    }
  },
  cardImage: {
    width: '100%',
    height: 180,
    objectFit: 'cover'
  },
  cardContent: {
    padding: theme.spacing(2)
  }
});
