import React from 'react';
import { Star, Quote } from 'lucide-react';
import './Testimonials.css';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Verified Buyer',
    image: 'https://i.pravatar.cc/150?img=32',
    rating: 5,
    review:
      'The quality exceeded my expectations. Fast delivery and excellent customer service.',
  },
  {
    id: 2,
    name: 'Michael Brown',
    role: 'Verified Buyer',
    image: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    review:
      'Shopping was incredibly easy. Products arrived earlier than expected.',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    role: 'Verified Buyer',
    image: 'https://i.pravatar.cc/150?img=44',
    rating: 5,
    review:
      'Beautiful packaging, premium quality, and fantastic support throughout.',
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">

        <div className="section-header">
          <span className="section-tag">
            Customer Reviews
          </span>

          <h2>Trusted by Thousands</h2>

          <p>
            See what our customers are saying about
            their shopping experience.
          </p>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="testimonial-card"
            >
              <Quote
                className="quote-icon"
                size={30}
              />

              <div className="stars">
                {[...Array(item.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill="currentColor"
                  />
                ))}
              </div>

              <p className="review">
                "{item.review}"
              </p>

              <div className="customer">
                <img
                  src={item.image}
                  alt={item.name}
                />

                <div>
                  <h4>{item.name}</h4>
                  <span>{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}