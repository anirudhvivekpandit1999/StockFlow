const StockMovementForm = ({ type }) => (
  <>
    <FormHeader title={type === 'inbound' ? 'New Inbound' : 'New Outbound'} />
    <EntitySection 
      title={type === 'inbound' ? 'Supplier Information' : 'Client Information'}
      entityType={type === 'inbound' ? 'supplier' : 'client'}
    />
    <ItemsSection />
    <FormActions />
  </>
);