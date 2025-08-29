import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


export const PhoneInputField = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <PhoneInput
      ref={ref}
      className={className}
      country={"us"}
      enableSearch
      inputStyle={{
        width: "100%",
        height: "44px",
        borderRadius: "6px",
        border: "1px solid #d1d5db",
        fontSize: "16px",
        padding: '10px 12px',
        paddingLeft: '80px',
        color: '#111827',
        backgroundColor: '#fff',
        outline: 'none',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }}
      buttonStyle={{
        border: "none",
        borderRight: '1px solid #d1d5db',
        background: "transparent",
        padding: '0 12px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        margin: 'auto',
        zIndex: 1,
        borderRadius: '6px 0 0 6px'
      }}
      dropdownStyle={{
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        position: 'absolute',
        left: 0,
        top: 'calc(100% + 4px)',
        margin: 0,
        border: '1px solid #d1d5db',
        backgroundColor: '#fff',
        zIndex: 1000
      }}
      containerStyle={{
        width: "100%",
        position: 'relative',
        overflow: 'visible',
        zIndex: 1
      }}
      searchStyle={{
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        marginBottom: '8px',
        backgroundColor: '#fff'
      }}
      dropdownArrowStyle={{
        color: '#6b7280'
      }}
      countrySelectorStyle={{
        backgroundColor: '#fff',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        padding: '8px'
      }}
      {...props}
    />
  );
});
