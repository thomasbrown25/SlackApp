const isFormEmpty = (formData) => {
    return !formData.username.length || !formData.email.length || !formData.password.length || !formData.password2.length;
}

const isPasswordValid = (password, password2) => {
    if (password.length < 6 || password2.length < 6) {
        return false 
    } else if (password !== password2) {
        return false
    } else {
        return true
    }
}

export { isFormEmpty, isPasswordValid }