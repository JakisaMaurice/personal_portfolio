#!/usr/bin/env python3

# Simple Word document creation without external libraries
# Creates a basic RTF file that can be opened in Word

def create_resume_rtf():
    rtf_content = r"""{\rtf1\ansi\deff0 {\fonttbl {\f0 Times New Roman;}}
\f0\fs24 
{\b\fs32 MUNGU JAKISA MAURICE\par}
{\fs20 COMPUTER SCIENCE STUDENT & SOFTWARE DEVELOPER\par}
\par
{\b Phone:} +256 750 302 070 | {\b Email:} jakisamaurice@gmail.com | {\b Location:} Kampala, Uganda\par
{\b LinkedIn:} linkedin.com/in/maurice-jakisa | {\b GitHub:} github.com/JakisaMaurice\par
\par
{\b\fs20 PROFESSIONAL SUMMARY\par}
Computer Science student at Makerere University with hands-on experience in web development, Arduino programming, enterprise server administration, and computer hardware maintenance. Proven ability to work independently and collaboratively on projects emphasizing autonomy, security, and innovation. Successfully completed IT internship at NCR Uganda with focus on Windows Server configuration, Active Directory management, VMware virtualization, and network security. Skilled in TypeScript, computer repair and maintenance, and advanced server configuration. Seeking opportunities to contribute to meaningful technology projects while continuing to grow expertise in software development and system administration.\par
\par
{\b\fs20 TECHNICAL SKILLS\par}
{\b Programming Languages:} C/C++, JavaScript, TypeScript, PHP, Python, Dart\par
{\b Web Development:} HTML5, CSS3, React, Node.js, NestJS, MySQL, PostgreSQL\par
{\b Systems Administration:} Windows Server, Active Directory, VMware, Ubuntu Server 22.04 LTS, Linux Networking, Docker\par
{\b Hardware & IoT:} Arduino, Raspberry Pi, Blynk IoT, Sensor Integration, IoT\par
{\b Tools & Technologies:} Git, Docker, Linux, SSH, Tailscale, NFS, Cockpit\par
\par
{\b\fs20 PROFESSIONAL EXPERIENCE\par}
{\b FULL-STACK DEVELOPER (APPRENTICE)} | Refactory Academy | Kampala, Central Region, Uganda | June 2025 - Present (8 mos)\par
\bullet Currently enrolled in intensive full-stack development apprenticeship program\par
\bullet Learning and applying modern web development technologies and best practices\par
\bullet Working on real-world projects with emphasis on full-stack development\par
\bullet Collaborating with mentors and fellow apprentices on team-based projects\par
\bullet Developing skills in project management and agile methodologies\par
{\b Skills:} Full-Stack Development \bullet Project Management\par
\par
{\b IT INTERN} | NCR Uganda | Kampala, Uganda | June 2024 - August 2024\par
\bullet Configured and maintained Windows Server 2019 environments and Active Directory Domain Services\par
\bullet Implemented VMware ESXi virtualization setup with proper resource allocation and network configuration\par
\bullet Provided technical support for hardware and software troubleshooting across enterprise infrastructure\par
\bullet Participated in system maintenance procedures, backup implementations, and security hardening\par
\bullet Gained hands-on experience with enterprise-level IT infrastructure supporting business operations\par
\bullet Collaborated with senior IT staff on network configuration and user access management\par
\par
{\b FREELANCE WEB DEVELOPER} | Self-Employed | Kampala, Uganda | 2023 - Present\par
\bullet Designed and developed responsive websites using HTML5, CSS3, JavaScript, and PHP\par
\bullet Implemented server-side functionality with database integration and user authentication systems\par
\bullet Created user-friendly interfaces focused on accessibility, performance optimization, and cross-browser compatibility\par
\bullet Collaborated with clients to understand requirements and deliver tailored solutions meeting business objectives\par
\bullet Managed project timelines and client communications for multiple concurrent web development projects\par
\par
{\b\fs20 KEY PROJECTS\par}
{\b Travel & Safaris Costing Software} | 2025 | React, TypeScript, NestJS, PostgreSQL\par
Professional travel and safaris costing software for tour operators. Features intelligent pricing & markup rule engine, modular itinerary creation, backend priority handling for markups, real-time cost recalculations, and clean, scalable TypeScript architecture designed for real-world tour operations.\par
{\b Outcome:} Production-ready SaaS application for tour operators.\par
\par
{\b Linux Home Lab Server} | 2025 | Ubuntu Server 22.04 LTS, Docker, SSH, Tailscale, NFS, Cockpit\par
Self-hosted infrastructure project using repurposed hardware. Configured static IP server using Netplan, disabled cloud-init network overrides, set up secure remote access using SSH and Tailscale, built NFS file server accessible across devices, managed services headlessly via SSH, added web-based server management using Cockpit, and deployed containerized services using Docker.\par
{\b Outcome:} Production-ready home lab for DevOps practice and self-hosting services.\par
\par
{\b Full-Stack Web Applications} | 2024 - Present | HTML5, CSS3, JavaScript, PHP, MySQL\par
Developed multiple responsive web applications including personal portfolio website, school management system, and attendance tracking system. Features include user authentication, database integration, responsive design, SEO optimization, and cross-browser compatibility.\par
{\b Outcome:} Several deployed web applications with positive client feedback.\par
\par
{\b Server Configuration & Virtualization} | 2024 | Windows Server, Active Directory, VMware ESXi, Cisco Networking\par
Enterprise server setup including domain controller configuration, Active Directory with organizational unit structure and group policies, VMware virtualization with proper resource allocation and network segmentation, DHCP and DNS configuration, and network security implementation.\par
{\b Outcome:} Enterprise-ready infrastructure supporting organizational IT operations during NCR internship.\par
\par
{\b Smart Home Control System (Arduino IoT)} | 2024 | Arduino, C++, Blynk IoT, Sensors, Relay Modules, IoT\par
Comprehensive home automation prototype focusing on security, access control, and autonomous operation. Integrated multiple sensors (temperature, humidity, motion) with mobile app control via Blynk platform. Implemented energy-efficient design with smart scheduling and automated response systems.\par
{\b Outcome:} Functional IoT prototype demonstrating mobile control and autonomous operation.\par
\par
{\b recipe_app (Flutter Mobile App)} | 2024 | Flutter, Dart, Mobile Development\par
Cross-platform mobile recipe book application with recipe search and filtering, user favorites and bookmarks, offline data storage, and modern UI with animations.\par
\par
{\b\fs20 EDUCATION\par}
{\b DIPLOMA IN COMPUTER SCIENCE} | Makerere University | Kampala, Uganda | 2023 - 2026\par
Completed comprehensive Computer Science diploma with focus on software development and system administration. Relevant Coursework: Data Structures, Algorithms, Database Systems, Computer Networks, Software Engineering.\par
\par
{\b NATIONAL CERTIFICATE IN ACCOUNTING AND FINANCE} | Uganda College of Commerce Pakwach | Pakwach, Uganda | 2019 - 2021\par
Completed accounting and finance certification with focus on financial management, bookkeeping, and business operations.\par
\par
{\b\fs20 LANGUAGES\par}
{\b English:} Fluent (Written & Verbal) | {\b Alur:} Native Speaker | {\b Luganda:} Conversational | {\b Swahili:} Beginner\par
\par
{\b\fs20 ACHIEVEMENTS\par}
\bullet Selected for Refactory Academy Apprenticeship - Competitive software development program | 2025\par
\bullet Successful Project Completion - NCR Uganda IT Internship with commendation for technical aptitude | 2024\par
\bullet Travel & Safaris Costing Software - Production-ready SaaS application for tour operators | 2025\par
\par
{\b\fs20 REFERENCES\par}
{\b Available upon request} - Contact information provided for professional references including:\par
\bullet NCR Uganda IT Department Supervisor\par
\bullet Makerere University Academic Advisor\par
\bullet Freelance Project Clients\par
}"""
    
    with open('Mungu_Jakisa_Maurice_Resume.rtf', 'w', encoding='utf-8') as f:
        f.write(rtf_content)
    
    print("Resume RTF file created successfully!")

if __name__ == "__main__":
    create_resume_rtf()