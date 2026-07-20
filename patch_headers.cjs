const fs = require('fs');
let code = fs.readFileSync('src/components/FormRenderer.tsx', 'utf8');

const badges = `
               formType === 'NEW_BIRTH_CERTIFICATE' ? 'NEW BIRTH CERTIFICATE' :
               formType === 'BIRTH_CERTIFICATE_CORRECTION' ? 'BIRTH CERTIFICATE CORRECTION' :
               formType === 'DEATH_CERTIFICATE' ? 'DEATH CERTIFICATE' :
`;
code = code.replace(
  "formType === 'KUVAR_BAI_MAMERU' ? 'KUVAR BAI MAMERU YOJANA' :",
  "formType === 'KUVAR_BAI_MAMERU' ? 'KUVAR BAI MAMERU YOJANA' :\n" + badges
);

const titles = `
               formType === 'NEW_BIRTH_CERTIFICATE' ? 'નવું જન્મ પ્રમાણપત્ર મેળવવા માટેનું અરજી ફોર્મ' :
               formType === 'BIRTH_CERTIFICATE_CORRECTION' ? 'જન્મ પ્રમાણપત્ર સુધારવા માટેનું અરજી ફોર્મ' :
               formType === 'DEATH_CERTIFICATE' ? 'મરણ પ્રમાણપત્ર મેળવવા માટેનું અરજી ફોર્મ' :
`;
code = code.replace(
  "formType === 'KUVAR_BAI_MAMERU' ? 'કુંવરબાઈનું મામેરું યોજના માટેનું અરજી ફોર્મ' :",
  "formType === 'KUVAR_BAI_MAMERU' ? 'કુંવરબાઈનું મામેરું યોજના માટેનું અરજી ફોર્મ' :\n" + titles
);

const subtitles = `
               formType === 'NEW_BIRTH_CERTIFICATE' ? 'Application Form for New Birth Certificate' :
               formType === 'BIRTH_CERTIFICATE_CORRECTION' ? 'Application Form for Birth Certificate Correction' :
               formType === 'DEATH_CERTIFICATE' ? 'Application Form for Death Certificate' :
`;
code = code.replace(
  "formType === 'KUVAR_BAI_MAMERU' ? 'Application for Kuvar Bai Mameru Yojana' :",
  "formType === 'KUVAR_BAI_MAMERU' ? 'Application for Kuvar Bai Mameru Yojana' :\n" + subtitles
);

fs.writeFileSync('src/components/FormRenderer.tsx', code);
