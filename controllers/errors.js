exports.getPageNotFound = (req, res, next) => {
    res.status(404).render('404Page', {
        pageTitle: 'Page Not Found',
        path: ''
    });
}

exports.getTechnicalErrorPage = (req, res, next) => {
    res.status(500).render('500Page', {
        pageTitle: 'Technical Error!',
        path: '/500Page',
        isAuthenticated: req.session.isLoggedIn,
    });
}