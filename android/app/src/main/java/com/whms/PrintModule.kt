
package com.whms

import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import android.util.Log
import com.basewin.services.ServiceManager
import com.basewin.aidl.OnPrinterListener;
import com.basewin.define.FontsType
import com.basewin.define.GlobalDef
import com.basewin.models.BitmapPrintLine
import com.basewin.models.PrintLine
import com.basewin.models.TextPrintLine
import com.basewin.utils.AppUtil
import com.basewin.zxing.utils.QRUtil

class PrintModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

            override fun getName() = "PrintModule"



      @ReactMethod
fun printText(text: String) {
    try {
        com.basewin.services.ServiceManager.getInstence().getPrinter().setPrintTypesettingType(GlobalDef.ANDROID_TYPESETTING)
        com.basewin.services.ServiceManager.getInstence().printer.cleanCache()
        com.basewin.services.ServiceManager.getInstence().printer.setLineSpace(2)
        com.basewin.services.ServiceManager.getInstence().printer.setPrintFont(FontsType.simsun)
        val textPrintLine = TextPrintLine()
        textPrintLine.type = PrintLine.TEXT
        textPrintLine.position = TextPrintLine.LEFT
        textPrintLine.size = TextPrintLine.FONT_NORMAL
        textPrintLine.isBold = false
        textPrintLine.content = text
        com.basewin.services.ServiceManager.getInstence().printer.addPrintLine(textPrintLine)
        com.basewin.services.ServiceManager.getInstence().printer.beginPrint(PrinterListener())
    } catch (e: Exception) {
        e.printStackTrace()
    }
}


  internal class PrinterListener : OnPrinterListener {
        private val TAG = "Print"
        override fun onStart() {
            // TODO 打印开始
            // Print start
            Log.e(TAG, "onStart")
        }

        override fun onFinish() {
            // TODO 打印结束
            // End of the print
            Log.e(TAG, "onFinish")
        }

        override fun onError(errorCode: Int, detail: String) {
            // TODO 打印出错
            // print error
          

           //Log.e(TAG, "print error errorcode = ")
        }
    }



}