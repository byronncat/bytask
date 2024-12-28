type Template = (...args: any[]) => string;
import { HOST_URL } from '@/constants/serverConfig';

export const createVerifyEmail: Template = ({
  username,
  verificationLink,
}: {
  username: string;
  verificationLink: string;
}) => `
  <div style="
      max-width: 600px;
      margin: 0 auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
      background-color: #ffffff;
    ">
    <!-- Header -->
    <div style="
        background-color: rgba(14, 165, 233, 0.7);
        text-align: center;
        padding: 24px 0;
      ">
      <a href="${HOST_URL}">
        <img
          src="cid:logo"
          alt="bytask-logo"
          style="
            display: block;
            margin: 0 auto;
            width: 64px;
            height: 64px;
          "
        />
      </a>
      <h1 style="
          font-weight: bold;
          font-size: 20px;
          margin-top: 8px;
          color: #ffffff;
        ">
        Verify Your Account
      </h1>
    </div>

    <!-- Content -->
    <div style="padding: 32px 24px; text-align: center;">
      <p style="color: #2d3748; font-size: 16px; margin-bottom: 16px;">
        Hello <strong>${username}</strong>,
      </p>
      <p style="color: #718096; font-size: 16px; margin-bottom: 24px;">
        To finalize your account setup with Bytask, we need to verify your email address. Click the link below to verify:
      </p>
      <form
        action="${verificationLink}"
        method="POST"
        style="display: inline-block; margin-top: 24px; cursor: pointer;"
      >
        <button
          type="submit"
          style="
            display: inline-block;
            padding: 12px 32px;
            background-color: rgb(14, 165, 233);
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
            border-radius: 6px;
            border: none;
            text-decoration: none;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            cursor: pointer;
          "
        >
          Verify my email
        </button>
      </form>
      <h2 style="
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin-top: 32px;
        ">
        Why Verification Matters
      </h2>
      <p style="color: #718096; font-size: 16px; margin-bottom: 16px;">
        <strong>Enhanced Security:</strong> Identity verification helps prevent unauthorized access and protects your financial information.
      </p>
      <p style="color: #718096; font-size: 16px;">
        <strong>Compliance:</strong> This process helps us comply with financial regulations and ensures a safe experience for all our clients.
      </p>
    </div>

    <!-- Footer -->
    <div style="
        background-color: #e5f3ff;
        text-align: center;
        padding: 16px;
        font-size: 14px;
        color: #4a5568;
      ">
      <p>© 2024 Bytask</p>
      <div style="margin-top: 8px;">
        <a
          href="#"
          style="
            color: #3182ce;
            text-decoration: underline;
            margin: 0 8px;
          "
        >
          Privacy Policy
        </a>
        |
        <a
          href="#"
          style="
            color: #3182ce;
            text-decoration: underline;
            margin: 0 8px;
          "
        >
          Contact Us
        </a>
      </div>
    </div>
  </div>
`;

export const createResetPasswordEmail: Template = ({
  username,
  resetLink,
}: {
  username: string;
  resetLink: string;
}) => `
  <div style="
      max-width: 600px;
      margin: 0 auto;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
      background-color: #ffffff;
    ">
    <!-- Header -->
    <div style="
        background-color: rgba(14, 165, 233, 0.7);
        text-align: center;
        padding: 24px 0;
      ">
      <a href="${HOST_URL}">
        <img
          src="cid:logo"
          alt="lms-logo"
          style="
            display: block;
            margin: 0 auto;
            width: 64px;
            height: 64px;
          "
        />
      </a>
      <h1 style="
          font-weight: bold;
          font-size: 20px;
          margin-top: 8px;
          color: #ffffff;
        ">
        Password Reset Request
      </h1>
    </div>

    <!-- Content -->
    <div style="padding: 32px 24px; text-align: center;">
      <p style="color: #2d3748; font-size: 16px; margin-bottom: 16px;">
        Hi <strong>${username}</strong>,
      </p>
      <p style="color: #718096; font-size: 16px; margin-bottom: 24px;">
        A password reset was requested for your account at <strong>Bytask</strong>.
      </p>
      <p style="color: #718096; font-size: 16px; margin-bottom: 24px;">
        To confirm this request and set a new password for your account, please click the button below:
      </p>
      <a
        href="${resetLink}"
        style="
          display: inline-block;
          padding: 12px 32px;
          background-color: rgb(14, 165, 233);
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          border-radius: 6px;
          text-decoration: none;
          margin-top: 24px;
        "
      >
        Reset My Password
      </a>
      <p style="color: #718096; font-size: 16px; margin-top: 24px;">
        <em>(This link is valid for 30 minutes from the time this reset was first requested.)</em>
      </p>
      <p style="color: #718096; font-size: 16px; margin-top: 24px;">
        If this password reset was not requested by you, no action is needed.
      </p>
    </div>

    <!-- Footer -->
    <div style="
        background-color: #e5f3ff;
        text-align: center;
        padding: 16px;
        font-size: 14px;
        color: #4a5568;
      ">
      <p>© 2024 Bytask</p>
      <div style="margin-top: 8px;">
        <a
          href="#"
          style="
            color: #3182ce;
            text-decoration: underline;
            margin: 0 8px;
          "
        >
          Privacy Policy
        </a>
        |
        <a
          href="#"
          style="
            color: #3182ce;
            text-decoration: underline;
            margin: 0 8px;
          "
        >
          Contact Us
        </a>
      </div>
    </div>
  </div>
`;
