import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;

import javax.swing.JFileChooser;


public class EntryPoint {
    public static File workingFile = null;
    public static File workingPath = null;

    public static void main(String ... args) throws IOException{
        if(args.length > 0){
            workingFile = new File(args[0]);
            workingPath = workingFile.getParentFile();
            process(workingFile);
            return;
        }

        JFileChooser chooser = new JFileChooser();
        chooser.setName("Choose and HTML file");
        chooser.setSelectedFile(new File(new File(".").getAbsolutePath()));

        int returnVal = chooser.showDialog(null,"Choose File");
        if(returnVal == JFileChooser.APPROVE_OPTION){
            workingFile = chooser.getSelectedFile();
            workingPath = chooser.getSelectedFile().getParentFile();

            System.out.println("opening: "+workingFile.getAbsolutePath());
            System.out.println("saving to: "+workingFile.getAbsolutePath()+".out");

            process(workingFile);
        }
    }

    public static void process(File file) throws IOException{
        // IN
        FileInputStream instream = new FileInputStream(file);
        DataInputStream in = new DataInputStream(instream);
        BufferedReader br = new BufferedReader(new InputStreamReader(in));

        //OUT
        FileWriter fw = new FileWriter(new File(file.getAbsolutePath()+".out"));
        PrintWriter pw = new PrintWriter(fw);

        // DO STUFF!!!
        String strLine;
        while ((strLine = br.readLine()) != null)   {
            System.out.println(strLine);
            if(strLine.contains("\"")){
                if(strLine.contains("link")){
                    pw.println("<style type=\"text/css\">\n"+extractCSS(strLine)+"\n</style>");
                }else if(strLine.contains("script")){
                    pw.println("<script>\n"+extractScript(strLine)+"\n</script>");
                }
                else{
                    pw.println(strLine);
                }
            }else{
                pw.println(strLine);
            }
        }

        in.close();
        pw.close();
    }

    public static String extractScript(String line) throws IOException{
        if(line.contains("src")){
            String newSegment = line.split("src")[1];
            return extractText(newSegment,line);
        }
        else{
            return line;
        }
    }

    public static String extractCSS(String line) throws IOException{
        if(line.contains("href")){
            String newSegment = line.split("href")[1];
            return extractText(newSegment,line);
        }
        else{
            return line;
        }
    }

    public static String extractText(String line,String totalLine) throws IOException{
        String toReturn="";
        boolean on = false;
        for(char c:line.toCharArray()){
            if(on){
                if(c=='"'){
                    return readEntireFile(toReturn);
                }

                toReturn+=c;

            }else if(c=='"'){
                on = true;
            }
        }
        return line;
    }

    public static String readEntireFile(String file) throws IOException{
        String toReturn = "/*\n *\t"+file+"\n */\n";

        FileInputStream fstream = new FileInputStream(new File(workingPath,file));
        // Get the object of DataInputStream
        DataInputStream in = new DataInputStream(fstream);
        BufferedReader br = new BufferedReader(new InputStreamReader(in));
        String strLine;
        //Read File Line By Line
        while ((strLine = br.readLine()) != null)   {
            // Print the content on the console
            toReturn += strLine+"\n";
        }
        //Close the input stream
        in.close();

        return toReturn;
    }
}
