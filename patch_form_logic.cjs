const fs = require('fs');
let code = fs.readFileSync('src/components/FormRenderer.tsx', 'utf8');

const validationLogic = `
      else if (formType === 'NEW_BIRTH_CERTIFICATE') {
        if (!newBirthDetails.childFullNameGu.trim()) newErrors.childFullNameGu = 'બાળકનું પૂરું નામ જરૂરી છે';
        if (!newBirthDetails.dob.trim()) newErrors.dob = 'જન્મ તારીખ જરૂરી છે';
      }
      else if (formType === 'BIRTH_CERTIFICATE_CORRECTION') {
        if (!birthCorrectionDetails.childFullNameGu.trim()) newErrors.childFullNameGu = 'બાળકનું પૂરું નામ જરૂરી છે';
      }
      else if (formType === 'DEATH_CERTIFICATE') {
        if (!deathDetails.informerFirstNameGu.trim()) newErrors.informerFirstNameGu = 'માહિતી આપનારનું નામ જરૂરી છે';
      }
`;

code = code.replace(
  "else if (formType === 'OTHER_SERVICE') {",
  validationLogic + "      else if (formType === 'OTHER_SERVICE') {"
);

const draftNameLogic = `
      else if (formType === 'NEW_BIRTH_CERTIFICATE') nameVal = newBirthDetails.childFullNameGu;
      else if (formType === 'BIRTH_CERTIFICATE_CORRECTION') nameVal = birthCorrectionDetails.childFullNameGu;
      else if (formType === 'DEATH_CERTIFICATE') nameVal = deathDetails.informerFirstNameGu;
`;

code = code.replace(
  "else if (formType === 'OTHER_SERVICE') nameVal = otherDetails.firstName;",
  "else if (formType === 'OTHER_SERVICE') nameVal = otherDetails.firstName;" + draftNameLogic
);

const activeLogic = `
      } else if (formType === 'NEW_BIRTH_CERTIFICATE') {
        activeDetails = newBirthDetails;
        activeDocs = newBirthDocs;
      } else if (formType === 'BIRTH_CERTIFICATE_CORRECTION') {
        activeDetails = birthCorrectionDetails;
        activeDocs = birthCorrectionDocs;
      } else if (formType === 'DEATH_CERTIFICATE') {
        activeDetails = deathDetails;
        activeDocs = deathDocs;
`;

code = code.replace(
  "} else if (formType === 'OTHER_SERVICE') {",
  activeLogic + "} else if (formType === 'OTHER_SERVICE') {"
);

const summaryLogic = `
                       formType === 'NEW_BIRTH_CERTIFICATE' ? 'નવું જન્મ પ્રમાણપત્ર (New Birth Certificate)' :
                       formType === 'BIRTH_CERTIFICATE_CORRECTION' ? 'જન્મ પ્રમાણપત્ર સુધારો (Birth Certificate Correction)' :
                       formType === 'DEATH_CERTIFICATE' ? 'મરણ પ્રમાણપત્ર (Death Certificate)' :
`;

code = code.replace(
  "formType === 'OTHER_SERVICE' ? 'અન્ય સેવાઓ (Other Services)' : 'અજાણ્યો પ્રકાર'",
  summaryLogic + "formType === 'OTHER_SERVICE' ? 'અન્ય સેવાઓ (Other Services)' : 'અજાણ્યો પ્રકાર'"
);

fs.writeFileSync('src/components/FormRenderer.tsx', code);
