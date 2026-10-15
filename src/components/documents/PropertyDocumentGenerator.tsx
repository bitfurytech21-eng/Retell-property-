import React from 'react';
import { Property } from '../../types/property';
import { PropertyDocumentType } from '../../types/document';
import { PropertyDocumentViewer } from './PropertyDocumentViewer';

interface PropertyDocumentGeneratorProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  initialType?: PropertyDocumentType;
  onDocumentUpdated?: () => void;
}

/**
 * PropertyDocumentGenerator Component
 * Renders the preview modal and official document suite (Brochures, Investment Overviews, Offers,
 * Reservation Requests, Agreement Drafts, Payment Schedules, and Checklists) for any listed property,
 * fully integrated with print styles and export capabilities.
 */
export const PropertyDocumentGenerator: React.FC<PropertyDocumentGeneratorProps> = ({
  property,
  isOpen,
  onClose,
  initialType = 'brochure',
  onDocumentUpdated,
}) => {
  if (!isOpen) return null;

  return (
    <PropertyDocumentViewer
      property={property}
      initialType={initialType}
      isOpen={isOpen}
      onClose={onClose}
      onDocumentUpdated={onDocumentUpdated}
    />
  );
};
