import React, { useState } from 'react';
import './Faqs.css'; // Optional: Add styles if you want

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "If any treads ,Do you give support during travel ?",
      answer: "Yes, we do call the trave provider and make assit them.",
    },
    {
      question: "If any of my family members are not well, do you provide support?",
      answer: "Yes, we try to give madical support alsd.",
    },
    {
      question: "If i lost any thing what you do?",
      answer: "We try to support you in a leggal way .",
    },
    {
      question: "drivers are experienced or not ?",
      answer: "Yeah driver are experienced.",
    },
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">FAQs</h2>
      <div className="accordion" id="faqAccordion">
        {faqs.map((faq, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${openIndex === index ? '' : 'collapsed'}`}
                type="button"
                onClick={() => toggle(index)}
              >
                {faq.question}
              </button>
            </h2>
            <div className={`accordion-collapse collapse ${openIndex === index ? 'show' : ''}`}>
              <div className="accordion-body">{faq.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
