const ColorPicker = (props) => {
  const { colors = [], selectedColor, onSelect } = props;

  const shadowColor = "#c4d1d1";
  // prev one #167f81

  return (
    <div style={{
      display: 'flex',
      height: 'fit-content',
      flexFlow: 'row wrap',
      width: '120px'
      }}
    >
      {colors.map((color, index) => (
        <span
          key={`color-${index}`}
          onClick={() => onSelect(color)}
          style={{
            marginLeft: "2px",
            width: selectedColor === color ? 25 : 28,
            height: selectedColor === color ? 25 : 28,
            borderRadius: '50%',
            backgroundColor: color,
            border: selectedColor === color ? `3px solid ${shadowColor}` : `2px solid #FAFAFA`,
            boxShadow: selectedColor === color ? `0 0 5px ${"#167f81"}` : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
          }}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
