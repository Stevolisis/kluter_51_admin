import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';

Quill.register('modules/imageResize', ImageResize);


export default function TextEditor({content,setContent}){

    
    const modules={
        toolbar:[
            [{font:[]}],
            [{header:[1,2,3,4,5,6,7]}],
            [{size:[]}],
            ['bold','underline','strike','bloquote'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [
                {list:'ordered'},
                {list:'bullet'},
                {indent:'-1'},
                {indent:'+1'}
            ],
            ['link','image','video'],
        ],
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize']
        }
    }


    return(
        <ReactQuill placeholder="<p>Whatsup</p>" theme="snow" 
            value={content} onChange={setContent} className='up' 
            modules={modules} />
    )
}
