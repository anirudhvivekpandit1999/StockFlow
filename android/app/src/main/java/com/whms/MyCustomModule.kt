package com.whms
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.basewin.services.ServiceManager
import com.basewin.aidl.OnPrinterListener
import com.basewin.define.FontsType
import com.basewin.define.GlobalDef
import com.basewin.models.BitmapPrintLine
import com.basewin.models.PrintLine
import com.basewin.models.TextPrintLine
import com.basewin.utils.AppUtil
import com.basewin.zxing.utils.QRUtil



class MyCustomModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext)  {
  
    override fun getName(): String {
        return "MyCustomModule"
    }

    @ReactMethod
    fun useJarFunctionality() {
        printBase();
    }

    // New method to print any text from JS
    @ReactMethod
    fun printText(text: String) {
        try {
            ServiceManager.getInstence().printer.setPrintTypesettingType(GlobalDef.PRINTERLAYOUT_TYPESETTING)
            ServiceManager.getInstence().printer.cleanCache()
            ServiceManager.getInstence().printer.setLineSpace(2)
            ServiceManager.getInstence().printer.setPrintFont(FontsType.simsun)
            val textPrintLine = TextPrintLine()
            textPrintLine.type = PrintLine.TEXT
            textPrintLine.position = TextPrintLine.LEFT
            textPrintLine.size = TextPrintLine.FONT_NORMAL
            textPrintLine.isBold = false
            textPrintLine.content = text
            ServiceManager.getInstence().printer.addPrintLine(textPrintLine)
            ServiceManager.getInstence().printer.beginPrint(PrinterListener())
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }


      private fun printBase() {
        try {
            ServiceManager.getInstence().printer.setPrintTypesettingType(GlobalDef.PRINTERLAYOUT_TYPESETTING);
            ServiceManager.getInstence().printer.cleanCache()
            //ServiceManager.getInstence().printer.setPrintGray(1500)
            ServiceManager.getInstence().printer.setLineSpace(2)
            ServiceManager.getInstence().printer.setPrintFont(FontsType.simsun)
            val textPrintLine = TextPrintLine()
            textPrintLine.type = PrintLine.TEXT
            textPrintLine.position = TextPrintLine.LEFT
            textPrintLine.size = TextPrintLine.FONT_NORMAL
            textPrintLine.isBold = true
          
            var spState = "1"
            when (spState) {
                "1", "2" -> spState = "Normal"
                "0" -> spState = "Locked"
                "3" -> spState = "Sensor Broken"
                else -> {
                }
            }
            textPrintLine.content = "SmartPeak Printer Test"
            ServiceManager.getInstence().printer.addPrintLine(textPrintLine)
            textPrintLine.position = PrintLine.CENTER
            textPrintLine.content = "---------------------------"
            ServiceManager.getInstence().printer.addPrintLine(textPrintLine)
            textPrintLine.position = PrintLine.LEFT
            textPrintLine.content = "Model: " + Build.MODEL
            ServiceManager.getInstence().printer.addPrintLine(textPrintLine)
            textPrintLine.position = PrintLine.LEFT
            textPrintLine.content = "Customer Name: " + AppUtil.getProp(
                "ro.customer.name",
                "SmartPeak"
            )
            ServiceManager.getInstence().printer.addPrintLine(textPrintLine)
            textPrintLine.position = PrintLine.LEFT
            textPrintLine.content = "DSN: 1" 
            ServiceManager.getInstence().printer.addPrintLine(textPrintLine)
            textPrintLine.position = PrintLine.LEFT
            textPrintLine.content = "SoftWare Version: 2" 
            ServiceManager.getInstence().printer.addPrintLine(textPrintLine)
            textPrintLine.position = PrintLine.LEFT
            textPrintLine.content = "SP Version: 3" 
            ServiceManager.getInstence().printer.addPrintLine(textPrintLine)
            textPrintLine.position = TextPrintLine.LEFT
            textPrintLine.content = "SP Status: $spState"
            ServiceManager.getInstence().printer.addPrintLine(textPrintLine)
            textPrintLine.position = TextPrintLine.LEFT
            textPrintLine.content = "SDK FrameWork Version: 4" 
            ServiceManager.getInstence().printer.addPrintLine(textPrintLine)
            textPrintLine.position = TextPrintLine.LEFT
            val ewm = QRUtil.getRQBMP("Smart Peak", 240)
            val ywm = QRUtil.getBarcodeBMP("8602161138268", 384, 120)
            val bitmapPrintLine = BitmapPrintLine()
            bitmapPrintLine.type = PrintLine.BITMAP
            bitmapPrintLine.position = PrintLine.CENTER
            textPrintLine.type = PrintLine.TEXT
            textPrintLine.position = PrintLine.CENTER
            textPrintLine.content = "                                         "
            ServiceManager.getInstence().printer.addPrintLine(textPrintLine)
            textPrintLine.content = "Phone Number: " + "8602161138268"
            ServiceManager.getInstence().printer.addPrintLine(textPrintLine)
            textPrintLine.position = TextPrintLine.LEFT
            bitmapPrintLine.bitmap = ywm
            ServiceManager.getInstence().printer.addPrintLine(bitmapPrintLine)
            textPrintLine.position = TextPrintLine.LEFT
            bitmapPrintLine.bitmap = ewm
            ServiceManager.getInstence().printer.addPrintLine(bitmapPrintLine)
            textPrintLine.content = "                                         "
            ServiceManager.getInstence().printer.addPrintLine(textPrintLine)
            ServiceManager.getInstence().printer.addPrintLine(textPrintLine)

            ServiceManager.getInstence().printer.beginPrint(PrinterListener())
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
            Log.e(TAG, "print error errorcode = $errorCode detail = $detail")
           //Log.e(TAG, "print error errorcode = ")
        }
    }

}
