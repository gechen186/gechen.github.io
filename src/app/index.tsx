import * as React from "react";
import "./global.less";
import PdfViewComponent from "./component/PDFViewer";
import PDFcontrol from "./component/PDFControl";
import SignWritePannel from "./component/SignWritePannel";
import { isPC } from "../util/help";
import { useCloneSignCanvas, useDrawSignInCanvas, useEditPdf } from "./hooks/";

const { useState, useCallback, useRef } = React;

function ProtocolPage() {
  const pdfFileRef = useRef<any>();
  const pdfViewerRef = useRef<any>();
  const isPdfEndLoadRef = useRef<boolean>(false);
  const [ isPdfBeginLoad, pdfBeginLoaded ] = useState(false);
  const [ pdfCanvasNeedLoad, triggerCanvasLoad ] = useState(0);
  const [ curPdfCanvas, saveCurPdfCanvas ] = useState<HTMLCanvasElement | null>(null);
  const [ showSignWritePannelState, toggleShowSignWritePannel ] = useState(false);
  // 添加渲染层
  const scale = useCloneSignCanvas(pdfCanvasNeedLoad, isPdfBeginLoad, isPdfEndLoadRef);
  const {
    addSignInCanvas,
    deleteSignInCanvas,
    updateSignList,
    uploadPdf,
    downloadPdf,
    saveSelectSign,
    signList,
    pdfReadBuffer
   } = useEditPdf(curPdfCanvas as HTMLCanvasElement, isPdfEndLoadRef);
  // 渲染层绘画
  useDrawSignInCanvas(curPdfCanvas as HTMLCanvasElement, signList, isPdfEndLoadRef);

  const showSignWritePannel = useCallback(() => {
    if (curPdfCanvas) {
      toggleShowSignWritePannel(true);
    }else{
      alert('请选择签名页')
    }
  }, [curPdfCanvas]);
  const hideSignWritePannel = useCallback(() => {
    toggleShowSignWritePannel(false);
  }, []);

  return <div className={`${isPC ? 'pcMode' : ''}`}>
    <div className="pdf-wrap">
      <PDFcontrol
        pdfViewerRef={pdfViewerRef}
        uploadPdf={uploadPdf}
        downloadPdf={downloadPdf}
        deleteSignInCanvas={deleteSignInCanvas}
        showSignWritePannel={showSignWritePannel}
      />
      <PdfViewComponent
        scale={scale}
        pdfFileRef={pdfFileRef}
        pdfViewerRef={pdfViewerRef}
        pdfReadBuffer={pdfReadBuffer as ArrayBuffer}
        signList={signList}
        curPdfCanvas={curPdfCanvas as HTMLCanvasElement}
        triggerCanvasLoad={triggerCanvasLoad}
        updateSignList={updateSignList}
        uploadPdf={uploadPdf}
        saveCurPdfCanvas={saveCurPdfCanvas}
        saveSelectSign={saveSelectSign}
        pdfBeginLoaded={pdfBeginLoaded}
      />
      <SignWritePannel
        showSignWritePannelState={showSignWritePannelState}
        hideSignWritePannel={hideSignWritePannel}
        addSignInCanvas={addSignInCanvas}
      />
    </div>
  </div>
}
export default ProtocolPage;