import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

export default function SunEditors({content,setContent}){
    return (
        <SunEditor 
            placeholder="Please type here..." 
            value={content} 
            onChange={setContent}
            setContents={content}
            height={'500px'}
            setOptions={{
                buttonList:[        ['undo', 'redo'],
                ['font', 'fontSize', 'formatBlock'],
                ['paragraphStyle', 'blockquote'],
                ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                ['fontColor', 'hiliteColor', 'textStyle'],
                ['removeFormat'],
                '/',
                ['outdent', 'indent'],
                ['align','list', 'lineHeight'],
                ['table', 'link', 'image', 'video', 'audio' 
                /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
                /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
                ['fullScreen'],
            ]
            }}
            // imageAccept='.jpg'
        />
    );
};
