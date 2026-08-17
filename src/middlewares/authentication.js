import jwt from 'jsonwebtoken'

export default function authentication(request, response, next) {
    const token = request.headers.token

    if (!token) {
        response.status(401).json({
            success: false,
            message: 'Unauthenticated user',
        })
        return
    }

    jwt.verify(token, process.env.API_KEY, (error, decoded) => {
        if (error) {
            response.status(401).json({
                success: false,
                message: 'Invalid token',
            })
            return
        }

        response.locals.email = decoded?.email
        response.locals.username = decoded?.username
        response.locals.authenticated = true
        next()
    })
}
