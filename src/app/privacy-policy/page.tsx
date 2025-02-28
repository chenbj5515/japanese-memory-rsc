export default async function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-[18px] leading-relaxed tracking-[0.4px]">

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <h1 className="text-5xl font-bold mb-6 text-left">Privacy Policy</h1>

        <h2 className="text-xl mb-2 text-[#5a5959]">Bunn Privacy Policy</h2>

        <p className="text-gray-600 mb-12 text-[#5a5959]">
          Last updated March 1, 2025
        </p>

        <div className="space-y-8 text-gray-700">
          <p>
            Welcome, and thank you for your interest in Bunn. This Privacy Policy outlines how we
            collect, use, and protect your information when you use our Service.
          </p>

          <div className="border-t border-gray-200 pt-8">
            <p className="font-bold  mb-4">PLEASE READ THE FOLLOWING PRIVACY POLICY CAREFULLY:</p>

            <p className="uppercase mb-8 text-gray-800">
              BY USING OUR SERVICE, YOU AGREE THAT YOU HAVE READ AND UNDERSTOOD, AND, AS A CONDITION TO YOUR USE OF THE
              SERVICE, YOU AGREE TO BE BOUND BY, THIS PRIVACY POLICY. IF YOU DO NOT AGREE TO THESE TERMS, THEN YOU DO
              NOT HAVE OUR PERMISSION TO USE THE SERVICE.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 ">1. Information We Collect</h2>
            <p className="mb-4">When you log in through Google or GitHub, we collect the following information:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Username</li>
              <li>Email address</li>
              <li>User ID</li>
              <li>Profile avatar</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 ">2. How We Collect Information</h2>
            <p>
              We collect this information when you authenticate through Google or GitHub login services. This
              information is provided to us directly from these platforms with your consent during the login process.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 ">3. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Provide and maintain our login services</li>
              <li>Deliver relevant advertisements for our products</li>
              <li>Improve and personalize your experience with our service</li>
              <li>Communicate with you about our services</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 ">4. Sharing Your Information</h2>
            <p>
              We do not share your personal information with third parties. For payment, all payment processing is
              handled directly by Stripe according to their privacy policy.Bunn do not store or retain any of your payment information on our servers.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 ">5. Data Storage and Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. We use industry-standard encryption and security protocols
              to safeguard your data. However, no method of transmission over the Internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 ">6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of communications from us</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the information provided in the "Contact Us"
              section.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 ">7. Cookies and Tracking Technologies</h2>
            <p>
              Our website only uses cookies to store login information to ensure your session is secure. We do not use
              cookies for advertising tracking or analytics purposes. These cookies are essential for providing you with
              a secure browsing experience on our site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 ">8. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy
              Policy periodically for any changes.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 ">9. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at</p>
            <p className="mt-2">
              <a href="mailto:chenbj55150220@gmail.com" className="text-blue-600 hover:underline">
                chenbj55150220@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}