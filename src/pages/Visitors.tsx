import { motion } from 'framer-motion';
import { MapPin, Users, TrendingUp, Building2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Helmet } from 'react-helmet-async';

const stateData = [
  { state: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'], highlight: 'Headquarters & Primary Market', icon: Building2, visitors: '35%' },
  { state: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'], highlight: 'Key Distribution Hub', icon: TrendingUp, visitors: '18%' },
  { state: 'Rajasthan', cities: ['Jaipur', 'Udaipur', 'Jodhpur', 'Ajmer'], highlight: 'Growing Market', icon: TrendingUp, visitors: '12%' },
  { state: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Hubli'], highlight: 'South India Hub', icon: MapPin, visitors: '10%' },
  { state: 'Delhi NCR', cities: ['New Delhi', 'Gurgaon', 'Noida', 'Faridabad'], highlight: 'North India Hub', icon: Building2, visitors: '8%' },
  { state: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai'], highlight: 'Emerging Market', icon: TrendingUp, visitors: '5%' },
  { state: 'Uttar Pradesh', cities: ['Lucknow', 'Varanasi', 'Kanpur'], highlight: 'Expanding Reach', icon: MapPin, visitors: '4%' },
  { state: 'Kerala', cities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode'], highlight: 'Ayurveda Hub', icon: MapPin, visitors: '4%' },
  { state: 'Madhya Pradesh', cities: ['Bhopal', 'Indore', 'Jabalpur'], highlight: 'Central India', icon: MapPin, visitors: '2%' },
  { state: 'West Bengal', cities: ['Kolkata', 'Siliguri', 'Durgapur'], highlight: 'East India', icon: MapPin, visitors: '2%' },
];

const Visitors = () => {
  return (
    <Layout>
      <Helmet>
        <title>Visitors & Distribution | Mittika by Ecovia</title>
        <meta name="description" content="Explore Mittika's presence across India. State-wise distribution and visitor information for our natural herbal products." />
      </Helmet>

      {/* Hero */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4"
          >
            <Users size={16} />
            Our Reach Across India
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4"
          >
            Visitors & Distribution
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            Mittika's pure herbal products reach customers across India. 
            Explore our state-wise presence and growing community of natural wellness enthusiasts.
          </motion.p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'States Covered', value: '28+' },
              { label: 'Cities Reached', value: '150+' },
              { label: 'Happy Customers', value: '10,000+' },
              { label: 'Monthly Visitors', value: '50,000+' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* State-wise Grid */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-2">State-wise Presence</h2>
            <p className="text-muted-foreground">Our distribution network across major Indian states</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stateData.map((item, index) => (
              <motion.div
                key={item.state}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-card transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-foreground text-lg">{item.state}</h3>
                      <span className="text-xs text-primary font-medium">{item.highlight}</span>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-primary">{item.visitors}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.cities.map((city) => (
                    <span key={city} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
                      {city}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expansion Note */}
      <section className="py-12 bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're continuously expanding our reach. If you're from a region not listed above and interested in 
            Mittika products, <a href="/contact" className="text-primary font-medium hover:underline">contact us</a> — 
            we deliver across India and are also open to distribution partnerships.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Visitors;
