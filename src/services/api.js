const API = 'http://localhost:8000'

// Regarding response, see documentation section 4.1. Responses

async function request(endpoint, options = {}, token) {
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    }

    const res = await fetch(`${API}${endpoint}`, {
        ...options,
        headers
    })

    let json
    try {
        json = await res.json()
    } catch {
        throw new Error('Invalid JSON response from server')
    }

    if (!res.ok) {
        throw new Error(json?.message || `HTTP error ${res.status}`)
    }

    if (json.message !== 'success') {
        throw new Error(json?.message || 'Unknown API error')
    }

    return json.data
}

// Documentation section 4.2. Authentication

export function login(data) {
    return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export function logout(token) {
    return request('/auth/logout', {
        method: 'POST'
    }, token)
}

export function forgotPassword(email) {
    return request('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
    })
}

export function getMe(token) {
    return request('/auth/me', {}, token)
}

// Documentation section 4.3. Employees

export function getEmployees(token, params = {}) {
    const query = new URLSearchParams(params).toString()
    return request(`/employees${query ? `?${query}` : ''}`, {}, token)
}

export function getEmployeeById(id, token) {
    return request(`/employees/${id}`, {}, token)
}

export function createEmployee(data, token) {
    return request('/employees', {
        method: 'POST',
        body: JSON.stringify(data)
    }, token)
}

export function updateEmployee(id, data, token) {
    return request(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }, token)
}

export function deleteEmployee(id, token) {
    return request(`/employees/${id}`, {
        method: 'DELETE'
    }, token)
}

// Documentation section 4.4. Events

export function getEvents(token, params = {}) {
    const query = new URLSearchParams(params).toString()
    return request(`/events${query ? `?${query}` : ''}`, {}, token)
}

export function getEventById(id, token) {
    return request(`/events/${id}`, {}, token)
}

export function createEvent(data, token) {
    return request('/events', {
        method: 'POST',
        body: JSON.stringify(data)
    }, token)
}

export function updateEvent(id, data, token) {
    return request(`/events/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }, token)
}

export function deleteEvent(id, token) {
    return request(`/events/${id}`, {
        method: 'DELETE'
    }, token)
}

// Documentation section 4.5. Rewards

export function getRewards(token, params = {}) {
    const query = new URLSearchParams(params).toString()
    return request(`/rewards${query ? `?${query}` : ''}`, {}, token)
}

export function getRewardById(id, token) {
    return request(`/rewards/${id}`, {}, token)
}

export function createReward(data, token) {
    return request('/rewards', {
        method: 'POST',
        body: JSON.stringify(data)
    }, token)
}

export function updateReward(id, data, token) {
    return request(`/rewards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }, token)
}

export function deleteReward(id, token) {
    return request(`/rewards/${id}`, {
        method: 'DELETE'
    }, token)
}

export function redeemReward(id, amount, token) {
    return request(`/rewards/${id}/redeem`, {
        method: 'POST',
        body: JSON.stringify({ amount })
    }, token)
}