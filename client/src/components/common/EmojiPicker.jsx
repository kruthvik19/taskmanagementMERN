import { Box, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Picker from '@emoji-mart/react'; // Import as default export
import data from '@emoji-mart/data'; // Emoji data import

const EmojiPicker = (props) => {
  const [selectedEmoji, setSelectedEmoji] = useState(); // For displaying the selected emoji
  const [isShowPicker, setIsShowPicker] = useState(false); // To toggle emoji picker visibility

  // Set the selected emoji from props if provided
  useEffect(() => {
    setSelectedEmoji(props.icon);
  }, [props.icon]);

  // When an emoji is selected from the picker
  const selectEmoji = (emoji) => {
    const selected = emoji.native; // The emoji object contains a 'native' field
    setIsShowPicker(false); // Hide picker after selection
    props.onChange(selected); // Pass the selected emoji to parent component
  };

  // Toggle picker visibility
  const showPicker = () => setIsShowPicker(!isShowPicker);

  return (
    <Box sx={{ position: 'relative', width: 'max-content' }}>
      <Typography
        variant="h3"
        fontWeight="700"
        sx={{ cursor: 'pointer' }}
        onClick={showPicker} // Toggle picker on click
      >
        {selectedEmoji || '🙂'} {/* Default emoji if none selected */}
      </Typography>
      
      {/* Emoji picker dropdown */}
      <Box
        sx={{
          display: isShowPicker ? 'block' : 'none', // Show/hide picker based on state
          position: 'absolute',
          top: '100%',
          zIndex: '9999',
        }}
      >
        <Picker data={data} onEmojiSelect={selectEmoji} theme="dark" />
      </Box>
    </Box>
  );
};

export default EmojiPicker;
