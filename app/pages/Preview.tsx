import { useInvitationStore } from '../store/useInvitationStore';
import { WeddingClassic } from '../templates/WeddingClassic';
import { BirthdayFun } from '../templates/BirthdayFun';
import { Seminar } from '../templates/Seminar';
import { OtherParty } from '../templates/OtherParty';
import { useEffect } from 'react';

export const Preview = ({ 
  isBuilder = false, 
  initialData, 
  invitationId,
  initialRsvps = [],
  deviceView = 'mobile'
}: { 
  isBuilder?: boolean; 
  initialData?: any;
  invitationId?: string;
  initialRsvps?: any[];
  deviceView?: 'mobile' | 'tablet' | 'desktop';
}) => {
  // We need to determine the templateId from initialData or the store.
  // In builder mode, we might just rely on the store since it is hydrated.
  const { data } = useInvitationStore();
  const templateId = (initialData?.templateId || data?.templateId) || 'wedding-classic';

  const props = { isBuilder, initialData, invitationId, initialRsvps, deviceView };

  if (templateId === 'birthday-fun') {
    return <BirthdayFun {...props} />;
  }
  
  if (templateId === 'seminar') {
    return <Seminar {...props} />;
  }
  
  if (templateId === 'other-party') {
    return <OtherParty {...props} />;
  }

  // Default to wedding classic
  return <WeddingClassic {...props} />;
};
