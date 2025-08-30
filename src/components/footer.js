import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
    return (
        <footer className="bg-black text-white py-5 mt-5">
            <div className="container">
                <div className="row">
                    {/* Brand + Description */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <h2 className="text-success fw-bold">REACT.</h2>
                        <p style={{ color: '#ccc' }}>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Id odit ullam iste repellat consectetur libero.
                        </p>
                    </div>

                    {/* Links Section */}
                    <div className="col-lg-2 col-md-6 mb-4">
                        <h5 className="fw-bold text-white">Solutions</h5>
                        <ul className="list-unstyled">
                            <li className="text-white-50">Analytics</li>
                            <li className="text-white-50">Marketing</li>
                            <li className="text-white-50">Commerce</li>
                            <li className="text-white-50">Insights</li>
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-6 mb-4">
                        <h5 className="fw-bold text-white">Support</h5>
                        <ul className="list-unstyled">
                            <li className="text-white-50">Pricing</li>
                            <li className="text-white-50">Documentation</li>
                            <li className="text-white-50">Guides</li>
                            <li className="text-white-50">API Status</li>
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-6 mb-4">
                        <h5 className="fw-bold text-white">Company</h5>
                        <ul className="list-unstyled">
                            <li className="text-white-50">About</li>
                            <li className="text-white-50">Blog</li>
                            <li className="text-white-50">Jobs</li>
                            <li className="text-white-50">Press</li>
                            <li className="text-white-50">Careers</li>
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-6 mb-4">
                        <h5 className="fw-bold text-white">Legal</h5>
                        <ul className="list-unstyled">
                            <li className="text-white-50">Claim</li>
                            <li className="text-white-50">Policy</li>
                            <li className="text-white-50">Terms</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
