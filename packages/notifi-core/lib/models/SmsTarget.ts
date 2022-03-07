 /**
 * Target object for SMS/phone numbers
 * 
 * @remarks
 * Target object for SMS/phone numbers
 * 
 * @property {string | null} id - Id of the SmsTarget used later to be added into a TargetGroup
 * @property {string | null} name - Friendly name (must be unique)
 * @property {string | null} phoneNumber - Phone number for the Target
 * @property {boolean} isConfirmed - Is confirmed? After adding it will be auto-confirmed. Users can opt-out with STOP codes
 * 
 */
export type SmsTarget = Readonly<{
  id: string | null;
  isConfirmed: boolean;
  name: string | null;
  phoneNumber: string | null;
}>;
