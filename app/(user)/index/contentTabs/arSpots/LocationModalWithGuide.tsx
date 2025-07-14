'use client';

import { useState, useEffect } from 'react';

import GuideModal from './modal/ARGuideModal';
import LocationModal from './modal/LocationModal';

interface Props {
  spot: {
    title: string;
    description: string;
    imageUrl: string;
    address?: string;
    collectibleTips?: string;
    arURL?: string;
  };
  open: boolean;
  onClose: () => void;
}

export default function LocationModalWithGuide({ spot, open, onClose }: Props) {
  const [showGuide, setShowGuide] = useState(false);
  const [showLocation, setShowLocation] = useState(open);

  // When parent tells us to open, sync state
  useEffect(() => {
    setShowLocation(open);
  }, [open]);

  function handleScanClick() {
    setShowLocation(false); // Hide location modal
    setShowGuide(true); // Show guide
  }

  function handleGuideClose() {
    setShowGuide(false);
    setShowLocation(true); // Restore location modal
  }

  function handleFinalRedirect() {
    window.open(spot.arURL || '/', '_blank');
  }

  return (
    <>
      <LocationModal
        open={showLocation}
        onClose={onClose}
        spot={spot}
        onScanClick={handleScanClick} // Custom prop we'll add below
      />
      <GuideModal
        open={showGuide}
        onClose={handleGuideClose}
        sx={{ zIndex: 1400 }} // Ensure it overlaps
        onFinish={handleFinalRedirect} // Optional callback when guide is done
      />
    </>
  );
}
