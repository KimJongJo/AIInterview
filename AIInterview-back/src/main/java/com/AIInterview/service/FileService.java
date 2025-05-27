package com.AIInterview.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class FileService {

    public String getDocument(MultipartFile file) {

        PDDocument document = null;

        try{
            document = PDDocument.load(file.getInputStream());
            PDFTextStripper stripper = new PDFTextStripper();

//            System.out.println("이력서 텍스트 추출 : \n" + text);
            return stripper.getText(document);
        } catch(IOException e){
            e.printStackTrace();
            return null;
        }finally{
            if(document != null){
                try{
                    document.close();
                }catch(IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
