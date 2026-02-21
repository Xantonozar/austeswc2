"use client";

import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function PanelMembers() {
  // Current members (Fall 24)
  const spring25Members = [
    {
      fullName: "MS Saida Sultana",
      designation: "Advisor",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757179766/WhatsApp_Image_2025-09-06_at_23.20.29_4be79188_kjhevc.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "Romana Yasmin",
      designation: "Treasurer",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757179766/WhatsApp_Image_2025-09-06_at_23.20.28_122406cb_rdipjx.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "Iftakhar Uddin",
      designation: "President",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657047/IMG_2334_-_Iftakhar_Uddin_Ifti_yzmkpm.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "Rupshree Chowdhury",
      designation: "Vice President",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657053/inbound5034993937930329136_-_RUPSHREE_CHOWDHURY_z8nxlk.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "Sazia Sultana Jui",
      designation: "General Secretary",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657049/inbound286412579528833322_-_SAZIA_SULTANA_JUI_kvljkd.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "AKM Saidur Rahman",
      designation: "Assistant General Secretary",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657044/350._350_-_A_K_M_Saidur_Rahman_Saurav_bjrfcq.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "MD Rayhan Bappy",
      designation: "Joint Secretary",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657047/IMG_5012_-_Shafiqul_Islam_wg5fug.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "Khandaker Musfiqul Alam Hamin",
      designation: "Joint Secretary",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657052/inbound1959372519812022781_-_KHANDAKER_MUSFIQUL_ALAM_HAMIM_1_qsbqzx.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "Shifat Estiak",
      designation: "Joint Secretary",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657052/inbound4045897525270537194_-_Md_Estiakuzzaman_l3i8ks.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "Md. Abu Bakar Siddique",
      designation: "Organizing Secretary",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657049/inbound1169359981169208947_-_Md._Abu_Bakar_Siddique_qitq7h.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "Hasibur Rashid Tokey",
      designation: "Organizing Secretary",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657047/IMG_6246_-_Hasibur_Rashid_Tokey_ggxlho.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "Amm Jakaria Haque Rifat",
      designation: "Organizing Secretary",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657049/inbound1169359981169208947_-_Md._Abu_Bakar_Siddique_qitq7h.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "Mostakim Shahriar Shakib",
      designation: "Organizing Secretary",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657048/IMG_20251015_081315_-_Shahriar_Shakib_u1ms7g.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "Kazi Rafi Rahman",
      designation: "Head of Logistics",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657050/inbound1499732402308872815_-_rafi_rahman_khaba6.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "Tasfia Hossain Raiba",
      designation: "Head of Event Management",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657048/IMG_7872_-_TASFIA_HOSSAIN_bp5skz.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "Md. Manjin Ahmed",
      designation: "Head of PR and Communication",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657047/20251229_121752_-_Manjin_Ahmed_pgjgho.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "Dewan Rayhan Rahman",
      designation: "Head of Content Writing",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657047/20251006_090208_-_AR_D_Rayhan_Rahman_xvpumt.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    },
    {
      fullName: "Motasim Misbah Mredul",
      designation: "Head of Graphics and Design",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1771657048/IMG_20260118_110746_059_2_3_-_Motasim_Misbah_wubtqi.jpg",
      social: { facebook: "https://facebook.com", instagram: "https://instagram.com", linkedin: "https://linkedin.com" }
    }
  ];

  // Fall 24 members
  const fall24Members = [
    {
      fullName: "MS Saida Sultana",
      designation: "Advisor",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757179766/WhatsApp_Image_2025-09-06_at_23.20.29_4be79188_kjhevc.jpg",
      social: {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      fullName: "Romana Yasmin",
      designation: "Treasurer",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757179766/WhatsApp_Image_2025-09-06_at_23.20.28_122406cb_rdipjx.jpg",
      social: {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      fullName: "Sayeed Jubayeer",
      designation: "President",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757140014/WhatsApp_Image_2025-09-06_at_12.26.17_e8b1cd6e_vouuro.jpg",
      social: {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      fullName: "Ramisha Tasnim",
      designation: "Vice President",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757180561/WhatsApp_Image_2025-09-06_at_23.42.09_7f7251b0_yf0xnl.jpg",
      social: {
        facebook: "https://facebook.com/bobwilson",
        instagram: "https://instagram.com/bobwilson",
        linkedin: "https://linkedin.com/in/bobwilson"
      }
    },
    {
      fullName: "MD Abdullah Al Naim",
      designation: "Genarel Secratory",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757179439/WhatsApp_Image_2025-09-06_at_23.21.20_bf771002_p8afqa.jpg",
      social: {
        facebook: "https://facebook.com/bobwilson",
        instagram: "https://instagram.com/bobwilson",
        linkedin: "https://linkedin.com/in/bobwilson"
      }
    },

    {
      fullName: "Iftikhar Uddin Ifti",
      designation: "Joint Secratory",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757142331/MHB01933_ugofwi.jpg",
      social: {
        facebook: "https://facebook.com/bobwilson",
        instagram: "https://instagram.com/bobwilson",
        linkedin: "https://linkedin.com/in/bobwilson"
      }
    },
    {
      fullName: "Rebeka Sultana Khusboo",
      designation: "Joint Secratory",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757137809/WhatsApp_Image_2025-09-06_at_11.47.29_3f0ac3b2_llh3q2.jpg",
      social: {
        facebook: "https://facebook.com/bobwilson",
        instagram: "https://instagram.com/bobwilson",
        linkedin: "https://linkedin.com/in/bobwilson"
      }
    },
    {
      fullName: "Shahria Akter Rithin",
      designation: "Joint Secratory",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757137809/WhatsApp_Image_2025-09-06_at_11.47.29_ed4cd26d_nhrneq.jpg",
      social: {
        facebook: "https://facebook.com/bobwilson",
        instagram: "https://instagram.com/bobwilson",
        linkedin: "https://linkedin.com/in/bobwilson"
      }
    },

    {
      fullName: "Sazia Sultana Jui",
      designation: "Organizing Secratory",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757137808/IMG-20250802-WA0002_1_2_1_1_iiftug.jpg",
      social: {
        facebook: "https://facebook.com/evarodriguez",
        instagram: "https://instagram.com/evarodriguez",
        linkedin: "https://linkedin.com/in/evarodriguez"
      }
    },
    {
      fullName: "Rupshree Chowdhury",
      designation: "Administrative Secratory",
      department: "",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757137807/20250628_225432_qz7eq8.jpg",
      social: {
        facebook: "https://facebook.com/evarodriguez",
        instagram: "https://instagram.com/evarodriguez",
        linkedin: "https://linkedin.com/in/evarodriguez"
      }
    },
    {
      fullName: "Shifat Istiak",
      designation: "Oparational Secratory",
      department: "Content Writing",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757137810/WhatsApp_Image_2025-09-06_at_11.45.29_95ac857d_kipcn4.jpg",
      social: {
        facebook: "https://facebook.com/evarodriguez",
        instagram: "https://instagram.com/evarodriguez",
        linkedin: "https://linkedin.com/in/evarodriguez"
      }
    },
    {
      fullName: "Hashibur Rashid Tokey",
      designation: "Oparational Secratory",
      department: "Sponsorship Management",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757137807/IMG_9745_sk8dl7.jpg",
      social: {
        facebook: "https://facebook.com/evarodriguez",
        instagram: "https://instagram.com/evarodriguez",
        linkedin: "https://linkedin.com/in/evarodriguez"
      }
    },
    {
      fullName: "Mostakim Shahriar Shakib",
      designation: "Oparational Secratory",
      department: "PR & Communication",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757137808/shahriar_ntwywn.jpg",
      social: {
        facebook: "https://facebook.com/evarodriguez",
        instagram: "https://instagram.com/evarodriguez",
        linkedin: "https://linkedin.com/in/evarodriguez"
      }
    },
    {
      fullName: "MD Rahman Bappy",
      designation: "Oparational Secratory",
      department: "Logistic",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757141115/WhatsApp_Image_2025-09-06_at_12.44.47_0f7812c6_pztvia.jpg",
      social: {
        facebook: "https://facebook.com/evarodriguez",
        instagram: "https://instagram.com/evarodriguez",
        linkedin: "https://linkedin.com/in/evarodriguez"
      }
    },
    {
      fullName: "Abu Bakar Siddque",
      designation: "Oparational Secratory",
      department: "Research and Developement",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757137810/WhatsApp_Image_2025-09-06_at_11.45.29_b320ecb6_jljulx.jpg",
      social: {
        facebook: "https://facebook.com/evarodriguez",
        instagram: "https://instagram.com/evarodriguez",
        linkedin: "https://linkedin.com/in/evarodriguez"
      }
    },
    {
      fullName: "A.K.M. Saidur Rahman",
      designation: "Oparational Secratory",
      department: "Event Management",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757137807/WhatsApp_Image_2025-09-06_at_11.47.27_ef9d681c_oguaka.jpg",
      social: {
        facebook: "https://facebook.com/evarodriguez",
        instagram: "https://instagram.com/evarodriguez",
        linkedin: "https://linkedin.com/in/evarodriguez"
      }
    },
    {
      fullName: "Mohammad Hasibur Rahman",
      designation: "Executive Director",
      department: "PR & Communication",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757137807/WhatsApp_Image_2025-09-06_at_11.47.27_794ac535_qicqvj.jpg",
      social: {
        facebook: "https://facebook.com/frankchen",
        instagram: "https://instagram.com/frankchen",
        linkedin: "https://linkedin.com/in/frankchen"
      }
    },
    {
      fullName: "Khandakar Mashfiqur Alam Hamim",
      designation: "Executive Director",
      department: "Event Management",
      image: "https://res.cloudinary.com/chirkut/image/upload/c_pad,b_gen_fill,ar_1:1/v1757137808/WhatsApp_Image_2025-09-06_at_11.47.28_a91d0bb6_fwky1l.jpg",
      social: {
        facebook: "https://facebook.com/frankchen",
        instagram: "https://instagram.com/frankchen",
        linkedin: "https://linkedin.com/in/frankchen"
      }
    },
    {
      fullName: "Sadia Karim",
      designation: "Executive Director",
      department: "Content Writing",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757137809/WhatsApp_Image_2025-09-06_at_11.47.29_f727d63b_fe2qc2.jpg",
      social: {
        facebook: "https://facebook.com/frankchen",
        instagram: "https://instagram.com/frankchen",
        linkedin: "https://linkedin.com/in/frankchen"
      }
    },
    {
      fullName: "Sanzida Sultana",
      designation: "Executive Director",
      department: "Sponsorship Management",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757137808/WhatsApp_Image_2025-09-06_at_11.47.25_9ca75b7c_vfe0vh.jpg",
      social: {
        facebook: "https://facebook.com/frankchen",
        instagram: "https://instagram.com/frankchen",
        linkedin: "https://linkedin.com/in/frankchen"
      }
    }, {
      fullName: "A M Jakaria Haque Rifat",
      designation: "Executive Director",
      department: "Logistics",
      image: "https://res.cloudinary.com/chirkut/image/upload/v1757137808/SAVE_20250804_214951_lxjy7a.jpg",
      social: {
        facebook: "https://facebook.com/frankchen",
        instagram: "https://instagram.com/frankchen",
        linkedin: "https://linkedin.com/in/frankchen"
      }
    },
    {
      fullName: "Yeasin Akhter",
      designation: "Executive Director",
      department: "Research & Developement",
      image: "https://res.cloudinary.com/chirkut/image/upload/c_pad,b_gen_fill,ar_1:1/v1757179766/WhatsApp_Image_2025-09-06_at_23.20.30_e8d4565b_wnagdx.jpg",
      social: {
        facebook: "https://facebook.com/frankchen",
        instagram: "https://instagram.com/frankchen",
        linkedin: "https://linkedin.com/in/frankchen"
      }
    },

  ];

  // Spring 24 members
  const spring24Members = [];

  // Fall 23 members
  const fall23Members = [];

  // Spring 23 members
  const spring23Members = [];

  // Helper function to group members by designation
  const groupMembersByDesignation = (members) => {
    return members.reduce((acc, member) => {
      if (!acc[member.designation]) {
        acc[member.designation] = [];
      }
      acc[member.designation].push(member);
      return acc;
    }, {});
  };

  // Helper function to render member cards
  const renderMemberCards = (members) => {
    const groupedMembers = groupMembersByDesignation(members);

    return Object.entries(groupedMembers).map(([designation, memberList]) => (
      <section key={designation} className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-3">
            {designation}
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 mx-auto rounded-full shadow-lg"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 lg:gap-6">
          {memberList.map((member, index) => (
            <motion.div
              key={index}
              className="text-center group w-64 lg:w-60 xl:w-64"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              {/* Circular Image Container with Border */}
              <div className="relative mb-6">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-300 transform group-hover:scale-105 border-4 border-emerald-200 group-hover:border-emerald-400">
                  <img
                    src={member.image}
                    alt={member.fullName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.log(`Failed to load image for ${member.fullName}:`, member.image);
                    }}
                  />
                </div>
              </div>

              {/* Member Information */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-emerald-800 group-hover:text-emerald-600 transition-colors duration-300">
                  {member.fullName}
                </h3>
                <p className="text-lg font-semibold text-green-600">
                  {member.designation}
                </p>
                <p className="text-sm text-emerald-700 max-w-xs mx-auto leading-relaxed">
                  {member.department}
                </p>
              </div>

              {/* Social Media Icons */}
              <div className="flex justify-center space-x-4 mt-6">
                <a
                  href={member.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href={member.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white hover:from-emerald-600 hover:to-green-600 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white hover:bg-teal-700 transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    ));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12">
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-0">
        <img src="/eswclogo.svg" alt="ESWC Watermark" className="opacity-10 w-2/3 max-w-3xl select-none" />
      </div>
      <div className="relative container mx-auto px-4 max-w-7xl z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-800 mb-6">
            Our Environmental Team
          </h1>
          <p className="text-xl text-emerald-700 max-w-4xl mx-auto leading-relaxed">
            Meet the dedicated panel members across different semesters who are committed to environmental sustainability and innovation.
          </p>
        </motion.div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 mb-8 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger
              value="current"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Current
            </TabsTrigger>
            <TabsTrigger
              value="spring25"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Spring 25
            </TabsTrigger>
            <TabsTrigger
              value="fall24"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Fall 24
            </TabsTrigger>
            <TabsTrigger
              value="spring24"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Spring 24
            </TabsTrigger>
            <TabsTrigger
              value="fall23"
              className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
            >
              Fall 23
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {renderMemberCards(spring25Members)}
            </motion.div>
          </TabsContent>

          <TabsContent value="spring25">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {renderMemberCards(spring25Members)}
            </motion.div>
          </TabsContent>

          <TabsContent value="fall24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {renderMemberCards(fall24Members)}
            </motion.div>
          </TabsContent>

          <TabsContent value="spring24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {renderMemberCards(spring24Members)}
            </motion.div>
          </TabsContent>

          <TabsContent value="fall23">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {renderMemberCards(fall23Members)}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

