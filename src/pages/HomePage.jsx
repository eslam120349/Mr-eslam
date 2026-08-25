import Hero from '../components/Hero.jsx'
import YearsSection from '../components/YearsSection.jsx'
import WhyUsSection from '../components/WhyUsSection.jsx'
import SEO from "../components/SEO";

export default function HomePage() {
  return (
    <div className="w-full">
      <SEO
  title="مستر اسلام سعيد | مدرس ماث Math - البكالوريا المصرية والثانوية العامة"
  description="مستر اسلام سعيد مدرس رياضيات متخصص في شرح وتأسيس Math لطلاب البكالوريا المصرية والثانوية العامة باللغة الإنجليزية."
  canonical="https://mreslam.cc.cd/"
  schema={{
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://mreslam.cc.cd/#person",
        name: "مستر اسلام سعيد",
        url: "https://mreslam.cc.cd/",
        jobTitle: "مدرس رياضيات",
        description:
          "مدرس رياضيات متخصص في شرح وتأسيس الرياضيات لطلاب البكالوريا المصرية والثانوية العامة.",
        knowsAbout: [
          "Mathematics",
          "Math",
          "Algebra",
          "Geometry",
          "Calculus",
          "Statistics",
          "البكالوريا المصرية",
          "الثانوية العامة",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://mreslam.cc.cd/#website",
        url: "https://mreslam.cc.cd/",
        name: "مستر اسلام | شرح وتأسيس ماث Math",
        inLanguage: "ar",
        publisher: {
          "@id": "https://mreslam.cc.cd/#person",
        },
      },
    ],
  }}
/>
      <Hero />
      <YearsSection />
      <WhyUsSection />
    </div>
  )
}
