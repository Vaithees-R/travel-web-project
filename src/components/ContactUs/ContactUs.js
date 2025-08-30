function ContactUs() {
  return (
    <div className="contact-container container mt-5">
      <h2 className="mb-4 text-center">📞 Contact Us</h2>

      <form className="contact-form d-flex flex-column gap-3">

        <input
          type="text"
          className="form-control"
          placeholder="Your Name"
        />

        <input
          type="email"
          className="form-control"
          placeholder="Your Email"
        />

        <input
          type="text"
          className="form-control"
          placeholder="Subject"
        />

        <textarea
          className="form-control"
          placeholder="Your Message"
          rows="5"
        ></textarea>

        <button type="submit" className="btn btn-primary w-100">
          Send Message
        </button>

      </form>
    </div>
  );
}

export default ContactUs;
