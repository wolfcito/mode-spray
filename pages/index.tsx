import { SetStateAction, useState } from "react";
import clsx from "clsx";
import { MetaHeader } from "~~/components/MetaHeader";
import { getParsedError } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

interface MyDictionaryProps {
  [key: string]: bigint;
}

export default function Home() {
  const [confirmtnxs, setConfirmtnxs] = useState<boolean>(false);
  const [alltxns, setAlltxns] = useState<string>("");
  const [everyTxns, setEveryTxns] = useState<MyDictionaryProps>({});
  const [allAddress, setAllAddress] = useState<string[]>([]);
  const [allValues, setAllValues] = useState<bigint[]>([]);

  const [totalcost, setTotalcost] = useState(BigInt("0"));

  const { writeAsync, isLoading, isSuccess } = useScaffoldContractWrite({
    contractName: "ModeDisperse",
    functionName: "disperseEther",
    args: [allAddress, allValues],
    value: totalcost,
  });

  const cleantxns = () => {
    setTotalcost(BigInt("0"));
    setAllAddress([]);
    setAllAddress([]);
    setAllValues([]);

    setEveryTxns({});
    setAlltxns("");
    setConfirmtnxs(false);
    console.log(totalcost, allValues, allAddress, everyTxns, alltxns, confirmtnxs);
  };

  const updateValue = (e: { target: { value: SetStateAction<string> } }) => {
    const contentTemp = String(e.target.value);

    contentValidation({ contentfull: contentTemp });
  };

  const contentValidation = ({ contentfull }: { contentfull: string }) => {
    try {
      const rows = contentfull.split("\n");

      rows.forEach(element => {
        const onerow = element.split(/[,\s;]+/);
        if (onerow[0].startsWith("0x") && onerow[0].length === 42) {
          everyTxns[onerow[0]] = BigInt(onerow[1]);
          allAddress.push(onerow[0]);
          allValues.push(BigInt(onerow[1]));
        }
      });

      setAlltxns(contentfull);
      setConfirmtnxs(true);

      setTotalcost(allValues.reduce((a, b) => a + b, BigInt(0)));
    } catch (e) {
      console.error("Invalid format");
      setConfirmtnxs(false);
    }
  };

  const sprayEth = async () => {
    if (writeAsync) {
      try {
        writeAsync();
        if (isSuccess) cleantxns();
      } catch (e: any) {
        const message = getParsedError(e);
        notification.error(message);
        setConfirmtnxs(false);
      }
    }
  };

  const pasteFromClipboard = async () => {
    const text = await navigator.clipboard.readText();

    setAlltxns(text);
    contentValidation({ contentfull: text });
  };

  return (
    <>
      <MetaHeader />

      <div className="flex flex-col items-center flex-grow w-full xl:w-[626px] pt-10 self-center">
        <div className="w-full p-5 md:border-t md:border-r border-t-secondary-content rounded-t-3xl">
          <div className="flex flex-col space-y-3 py-7 rounded-3xl">
            <button
              className="text-xs text-right underline text-accent underline-offset-2 hover:text-neutral-content"
              onClick={pasteFromClipboard}
            >
              Paste from Clipboard
            </button>
            <textarea
              value={alltxns}
              onChange={updateValue}
              placeholder="0x6a22F6308a9a8D40eb7585F16BBd73913cF98633 100000000000000"
              className="w-full rounded-lg textarea textarea-bordered textarea-primary textarea-sm min-h-[135px]"
            ></textarea>
            <button className="text-xs text-right underline text-accent underline-offset-2" onClick={cleantxns}>
              clear
            </button>
          </div>
        </div>
        {confirmtnxs ? (
          <div className="flex flex-col pb-10">
            <p>Confirm your transactions</p>
            <table className="table table-zebra">
              {/* head */}
              <thead>
                <tr>
                  <th>txn</th>
                  <th>address</th>
                  <th className="text-right">amount</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(everyTxns).map(({ "0": address, "1": amount }, index) => (
                  <tr key={`${address}-row`}>
                    <th>{index + 1}</th>
                    <td>{address}</td>
                    <td className="text-right">{amount.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pt-2 pb-3 pr-4 text-sm font-semibold text-right border-t border-secondary text-neutral-content">
              {`Total amount: (wei) ${totalcost}`}
            </div>
            <Button onclick={sprayEth} label="Spray" className="self-center my-5 w-36" disabled={isLoading} />
          </div>
        ) : null}
      </div>
    </>
  );
}

function Button({
  onclick,
  label = "button",
  className,
  disabled,
}: {
  label?: string;
  onclick: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onclick}
      className={clsx(
        "btn bg-neutral-content rounded-md text-neutral hover:bg-neutral-content disabled:bg-neutral-content/50 disabled:text-neutral",
        className,
      )}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
