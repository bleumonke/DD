import { useEffect, useRef, useState } from 'react'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const countryOptions = [
  { value: '+91', label: '🇮🇳 +91' },
  { value: '+1', label: '🇺🇸 +1' },
]

export default function Login() {
  const navigate = useNavigate()

  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [countryCode, setCountryCode] = useState(countryOptions[0])
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(30)
  const [resendEnabled, setResendEnabled] = useState(false)

  const otpRef = useRef<HTMLInputElement>(null)

  const formatPhoneNumber = (value: string) => {
    let digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6)
      return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  const formatOtp = (value: string) => {
    let digits = value.replace(/\D/g, '').slice(0, 6)
    return digits.length <= 3
      ? digits
      : `${digits.slice(0, 3)}-${digits.slice(3)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value))
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(formatOtp(e.target.value))
    setError('')
  }

  const handleLogin = () => {
    const rawPhone = phone.replace(/\D/g, '')
    if (rawPhone.length !== 10) {
      setError('Please enter a valid 10-digit phone number.')
      return
    }
    setStep('otp')
    setTimer(30)
    setResendEnabled(false)
  }

  const handleVerifyOtp = () => {
    const rawOtp = otp.replace(/\D/g, '')
    if (rawOtp === '123456') {
      navigate('/')
    } else {
      setError('Invalid OTP. Please try again.')
    }
  }

  const handleResendOtp = () => {
    setOtp('')
    setError('')
    setTimer(30)
    setResendEnabled(false)
  }

  const handleBackToLogin = () => {
    setStep('phone')
    setOtp('')
    setError('')
  }

  useEffect(() => {
    if (step === 'otp') {
      otpRef.current?.focus()
    }
  }, [step])

  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((t) => t - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
    if (timer === 0) {
      setResendEnabled(true)
    }
  }, [timer, step])

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-image">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
            alt="Login"
          />
        </div>

        <div className="login-form">
          {error && <div className="error-banner">{error}</div>}

          <div className="form-content">
            <h1>Welcome Back</h1>

            {step === 'phone' && (
              <>
                <p>Login with your mobile number</p>
                <div className="form-row">
                  <div className="input-group">
                    <Select
                      options={countryOptions}
                      value={countryCode}
                      onChange={(selected) => setCountryCode(selected!)}
                      classNamePrefix="react-select"
                      isSearchable={false}
                      styles={{
                        control: (base) => ({ ...base, flex: '0 0 100px' }),
                        menu: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                    <input
                      type="tel"
                      placeholder="987-654-3210"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="phone-input"
                      maxLength={12}
                    />
                  </div>
                  <button onClick={handleLogin} className="login-btn">Login</button>
                </div>
              </>
            )}

            {step === 'otp' && (
              <div className="form-row">
                <p>
                  Enter the 6-digit OTP sent to{' '}
                  <strong>{countryCode.value} {phone}</strong>
                </p>

                <input
                  ref={otpRef}
                  type="tel"
                  placeholder="XXX-XXX"
                  value={otp}
                  onChange={handleOtpChange}
                  maxLength={7}
                  className="otp-input"
                />

                <button onClick={handleVerifyOtp} className="login-btn">Verify OTP</button>

                <div className="otp-footer">
                  {resendEnabled ? (
                    <p onClick={handleResendOtp} className="resend-btn">
                      Resend OTP
                    </p>
                  ) : (
                    <span className="timer">Resend in {timer}s</span>
                  )}
                </div>

                <button onClick={handleBackToLogin} className="back-btn">
                  ← Back to Login
                </button>
              </div>
            )}
          </div>

          <small className="footer-text">
            By continuing, you agree to our Terms and Privacy Policy.
          </small>
        </div>
      </div>
    </div>
  )
}
