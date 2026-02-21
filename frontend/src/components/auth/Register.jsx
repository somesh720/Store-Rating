import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaStore } from 'react-icons/fa';
import { validateName, validateEmail, validatePassword } from '../../utils/validators';

const Register = () => {
	const [formData, setFormData] = useState({
		role: 'normal_user',
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		address: ''
	});

	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const [apiError, setApiError] = useState('');
	const { register } = useAuth();
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.role) {
			newErrors.role = 'Role is required';
		}

		const nameError = validateName(formData.name);
		if (nameError) newErrors.name = nameError;

		const emailError = validateEmail(formData.email);
		if (emailError) newErrors.email = emailError;

		const passwordError = validatePassword(formData.password);
		if (passwordError) newErrors.password = passwordError;

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setLoading(true);
		setApiError('');

		try {
			const response = await register({
				role: formData.role,
				name: formData.name,
				email: formData.email,
				password: formData.password,
				address: formData.address
			});

			if (response?.user) {
				// Optional: role-based redirect
				if (response.user.role === 'admin') {
					navigate('/admin/dashboard');
				} else if (response.user.role === 'store_owner') {
					navigate('/store/dashboard');
				} else {
					navigate('/user/dashboard');
				}
			}
		} catch (err) {
			setApiError(err.response?.data?.message || 'Registration failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans text-gray-900 py-8">
			<main className="w-full max-w-md p-6">
				<section className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
					<header className="mb-8 text-center">
						<div className="flex justify-center mb-4">
							<FaStore className="text-4xl text-blue-600" />
						</div>
						<h1 className="text-2xl font-bold tracking-tight text-gray-900">
							Create Account
						</h1>
						<p className="text-sm text-gray-500 mt-2">
							Join our community of store reviewers today.
						</p>
					</header>

					{apiError && (
						<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
							{apiError}
						</div>
					)}

					<form className="space-y-4" onSubmit={handleSubmit}>
						
						{/* Role */}
						<div>
							<label htmlFor="role" className="block text-sm font-medium text-gray-700">
								Role *
							</label>
							<select
								id="role"
								name="role"
								value={formData.role}
								onChange={handleChange}
								className={`mt-1 block w-full px-3 py-2 border ${
									errors.role ? 'border-red-500' : 'border-gray-300'
								} bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
								required
							>
								<option value="normal_user">Normal User</option>
								<option value="store_owner">Store Owner</option>
								<option value="admin">Admin</option>
							</select>
							{errors.role && (
								<p className="mt-1 text-xs text-red-600">{errors.role}</p>
							)}
						</div>

						{/* Name */}
						<div>
							<label className="block text-sm font-semibold mb-1" htmlFor="name">
								Full Name
							</label>
							<input
								id="name"
								name="name"
								type="text"
								value={formData.name}
								onChange={handleChange}
								className={`w-full px-4 py-2 border ${
									errors.name ? 'border-red-500' : 'border-gray-300'
								} rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition`}
								placeholder="John Doe (20-60 characters)"
								required
								autoComplete="name"
							/>
							{errors.name && (
								<p className="mt-1 text-xs text-red-600">{errors.name}</p>
							)}
						</div>

						{/* Email */}
						<div>
							<label className="block text-sm font-semibold mb-1" htmlFor="email">
								Email Address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleChange}
								className={`w-full px-4 py-2 border ${
									errors.email ? 'border-red-500' : 'border-gray-300'
								} rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition`}
								placeholder="you@example.com"
								required
								autoComplete="email"
							/>
							{errors.email && (
								<p className="mt-1 text-xs text-red-600">{errors.email}</p>
							)}
						</div>

						{/* Password */}
						<div>
							<label className="block text-sm font-semibold mb-1" htmlFor="password">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								value={formData.password}
								onChange={handleChange}
								className={`w-full px-4 py-2 border ${
									errors.password ? 'border-red-500' : 'border-gray-300'
								} rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition`}
								placeholder="••••••••"
								required
								autoComplete="new-password"
							/>
							{errors.password && (
								<p className="mt-1 text-xs text-red-600">{errors.password}</p>
							)}
						</div>

						{/* Confirm Password */}
						<div>
							<label className="block text-sm font-semibold mb-1" htmlFor="confirmPassword">
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								value={formData.confirmPassword}
								onChange={handleChange}
								className={`w-full px-4 py-2 border ${
									errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
								} rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition`}
								placeholder="••••••••"
								required
								autoComplete="new-password"
							/>
							{errors.confirmPassword && (
								<p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
							)}
						</div>

						{/* Address */}
						<div>
							<label className="block text-sm font-semibold mb-1" htmlFor="address">
								Address (Optional)
							</label>
							<textarea
								id="address"
								name="address"
								value={formData.address}
								onChange={handleChange}
								rows="3"
								className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
								placeholder="Enter your address (max 400 characters)"
								autoComplete="street-address"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? 'Creating Account...' : 'Create Account'}
						</button>
					</form>

					<footer className="mt-8 pt-6 border-t border-gray-100 text-center">
						<p className="text-sm text-gray-600">
							Already have an account?{' '}
							<button
								onClick={() => navigate('/login')}
								className="text-blue-600 font-bold hover:underline"
							>
								Log In
							</button>
						</p>
					</footer>
				</section>
			</main>
		</div>
	);
};

export default Register;