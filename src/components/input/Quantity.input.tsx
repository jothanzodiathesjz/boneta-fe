import React, { useState } from "react";
import { Button } from "primereact/button";

interface QuantityInputProps {
  initialValue?: number;
  onAdd?: () => void;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  initialValue = 0,
  onAdd,
}) => {
  const [value, setValue] = useState<number>(initialValue);

  const increment = () => {
    setValue((prevValue) => prevValue + 1);
  };

  const decrement = () => {
    setValue((prevValue) => Math.max(0, prevValue - 1)); // Pastikan nilai tidak kurang dari 0
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row w-full justify-between items-center gap-3">
        <span className="font-semibold">RP 50000</span>
        <div className="flex items-center">
          <Button
            className="z-auto"
            label="-"
            severity="danger"
            onClick={decrement}
          />
          <span className="mx-3 text-center">{value}</span>
          <Button label="+" severity="danger" onClick={increment} />
        </div>
      </div>
    </div>
  );
};

export default QuantityInput;
